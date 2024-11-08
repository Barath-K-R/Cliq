import ChatModel from "../models/ChatModel.js";
import ChatMembersModel from "../models/ChatMembersModel.js";
import UserModel from "../models/UserModel.js";
import PermissionModel from "../models/PermissionModel.js";
import RoleModel from "../models/RolesModel.js";
import { Op } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";
import ChatPermissionModel from "../models/ChatPermissionModel.js";

export const createChatSequelize = async (req, res) => {
  const {
    currentUserId,
    userIds,
    chatType,
    name,
    description,
    visibility,
    scope,
  } = req.body;


  try {
    const num_of_users = userIds.length;

    //checking if the chat already exists
    const chatExistsQuery = `
      SELECT c.id, c.chat_type
      FROM chats c
      JOIN chat_members cm ON c.id = cm.chat_id
      WHERE c.chat_type IN ('direct', 'group', 'channel')
        AND cm.user_id IN (:tempuserIds)
      GROUP BY c.id, c.chat_type
      HAVING COUNT(DISTINCT cm.user_id) =:num_of_users
        AND COUNT(DISTINCT cm.user_id) = (
          SELECT COUNT(*)
          FROM chat_members cm2
          WHERE cm2.chat_id = c.id
        )
      LIMIT 1;
    `;

    const tempuserIds = [...userIds, currentUserId];
    const chatExists = await sequelize.query(chatExistsQuery, {
      replacements: { tempuserIds, num_of_users },
      type: sequelize.QueryTypes.SELECT,
    });

    

    if (chatExists.length > 0)
      return res.send({ message: "chat already exits", chatExists });

    const role = await RoleModel.findOne({
      where: { name: 'member' },
      attributes: ['id'],
    });

    const role_id = role ? role.id : null;

    if (chatType === "direct") {
      console.log("DIRECT");
      // Create new chat
      const newChat = await ChatModel.create({
        chat_type: chatType,
      });

      // Add members to the chat
      await ChatMembersModel.bulkCreate([
        { chat_id: newChat.id, user_id: currentUserId,role_id},
        { chat_id: newChat.id, user_id: userIds[0],role_id},
      ]);

      const newChatWithMembers = await ChatModel.findOne({
        where: { id: newChat.id },
        include: [
          {
            model: UserModel,
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
        ],
      });

      return res.send({
        newChat: newChatWithMembers,
        message: "New chat created and users added.",
      });
    } else if (chatType === "group") {
      console.log("GROUP");

      // Create new group chat
      const newGroup = await ChatModel.create({
        chat_type: chatType,
        name,
        description,
      });

      // Add members to the chat
      const groupMembers = userIds.map((user) => ({
        chat_id: newGroup.id,
        user_id: user,
        role_id
      }));
      groupMembers.push({ chat_id: newGroup.id, user_id: currentUserId,role_id });

      await ChatMembersModel.bulkCreate(groupMembers);

      const newGroupWithMembers = await ChatModel.findOne({
        where: { id: newGroup.id },
        attributes: ["id", "name"],
      });

      return res.send({
        newChat: newGroupWithMembers,
        message: "New chat created and users were added successfully",
      });
    } else {
      // Create new channel chat
      const newChannel = await ChatModel.create({
        chat_type: chatType,
        name,
        description,
        visibility,
        scope,
      });

      // Add members to the chat
      const channelMembers = userIds.map((user) => ({
        chat_id: newChannel.id,
        user_id: user,
        role_id
      }));
      channelMembers.push({ chat_id: newChannel.id, user_id: currentUserId,role_id});

      await ChatMembersModel.bulkCreate(channelMembers);

      const newChannelWithMembers = await ChatModel.findOne({
        where: { id: newChannel.id },
        attributes: ["id", "name"],
      });

      return res.send({
        newChat: newChannelWithMembers,
        message: "New chat created and users were added successfully",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Check if the chat exists
    const chat = await ChatModel.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Delete the chat, cascading the deletion to related records
    await chat.destroy();

    return res.status(200).json({ message: "Chat and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete chat" });
  }
};

export const getCurrentUserChatsSequelize = async (req, res) => {
  console.log("getting current chats");
  try {
    const type = req.query.type;
    const { userId } = req.params;
    console.log(type + " " + userId);
    console.log(type);
    if (!type || !userId) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    let chats;
    if (type === "direct") {
      console.log("Fetching direct chats");

      chats = await ChatMembersModel.findAll({
        attributes: ["chat_id"],
        where: {
          chat_id: {
            [Op.in]: sequelize.literal(`(
              SELECT chat_id 
              FROM chat_members 
              WHERE user_id = ${userId}
            )`),
          },
          user_id: {
            [Op.ne]: userId,
          },
        },
        include: [
          {
            model: UserModel,
            attributes: ["id", "username"],
          },
          {
            model: ChatModel,
            where: {
              chat_type: type,
            },
            attributes: ["id", "name", "chat_type"],
          },
        ],
      });
    } else {
      chats = await ChatMembersModel.findAll({
        attributes: ["chat_id"],
        include: [
          {
            model: ChatModel,
            attributes: [
              "name",
              "description",
              "visibility",
              "scope",
              "chat_type",
            ],
            where: { chat_type: type },
          },
        ],
        where: {
          user_id: userId, // Filter by user ID
        },
      });
    }
    console.log(chats);
    return res.send(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getChatMembersSequelize = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chatMembers = await ChatMembersModel.findAll({
      where: { chat_id: chatId },
      include: [
        {
          model: UserModel,
          attributes: ["id", "username"],
        },
        {
          model:RoleModel,
          attributes:["name"],
        }
      ],
      attributes: ["user_id", "role_id", "joined_at"],
    });

    res.send(chatMembers);
  } catch (err) {
    console.error("Error fetching chat members:", err);
    res.status(500).send("Couldn't retrieve the members.");
  }
};

export const addMembersToChat = async (req, res) => {
  const { chatId } = req.params;
  const userIds = req.body;
  try {
    const chat = await ChatModel.findByPk(chatId);
    if (!chat) {
      return res.status(404).send("chat not found");
    }

    // Validate if the users exist
    const users = await UserModel.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).send("One or more users not found");
    }

    const role = await RoleModel.findOne({
      where: { name: 'member' },
      attributes: ['id'],
    });

    const role_id = role ? role.id : null;

    const groupIds = userIds.map((id) => {
      return { chat_id: chatId, user_id: id,role_id};
    });
    const newMembers = await ChatMembersModel.bulkCreate(groupIds);
    return res.send(newMembers);
  } catch (error) {
    console.error(error);
  }
};

export const removeMembersFromChat = async (req, res) => {
  const { chatId } = req.params;
  const { userIds } = req.body;
  console.log(userIds)
  try {
    const chat = await ChatModel.findByPk(chatId);
    if (!chat) {
      return res.status(404).send("chat not found");
    }

    // Validate if the users exist
    const users = await UserModel.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).send("One or more users not found");
    }

    const groupIds = userIds.map((id) => {
      return { chat_id: chatId, user_id: id };
    });
    const removedMembers = await ChatMembersModel.destroy({
      where: {
        [Op.or]: groupIds,
      },
    });

    return res.send({
      removedMembers,
      message: "users were removed successfully from the chat",
    });
  } catch (error) {
    console.error(error);
  }
};

export const getRolePermissions = async (req, res) => {
  const { chatId, roleId } = req.params;
  console.log(chatId + " " + roleId);
  try {
    const response = await ChatPermissionModel.findAll({
      where: {
        chat_id: chatId,
        role_id: roleId,
      },
      include: [
        {
          model: PermissionModel,
          attributes: ["name"],
        },
      ],
      attributes: ["chat_id", "role_id"],
    });
    return res.send(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllRolePermissions = async (req, res) => {
  const { chatId } = req.params; 
  console.log("Fetching permissions for chatId: " + chatId);

  try {
    const response = await ChatPermissionModel.findAll({
      where: {
        chat_id: chatId,
      },
      include: [
        {
          model: PermissionModel,
          attributes: ["name"], 
        },
        {
          model: RoleModel, 
          attributes: ["name"], 
        },
      ],
      attributes: ["role_id"], 
    });
    
    // Prepare flat results
    const flatResults = response.map(item => ({
      role_name: item.Role.name,
      permission_name: item.Permission.name,
    }));

    console.log(flatResults);
    
    return res.json(flatResults);
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return res.status(500).json({ error: "An error occurred while fetching permissions." });
  }
};


export const addRolePermissions = async (req, res) => {
  console.log(req.body);
  const roles = req.body; 
  const { chatId } = req.params;

  try {
    const roleMappings = {
      admin: "admin",
      moderator: "moderator",
      member: "member",
    };

    for (const [role, newPermissions] of Object.entries(roles)) {
     
      const roleRecord = await RoleModel.findOne({
        where: { name: roleMappings[role] },
      });
      if (!roleRecord) {
        return res.status(400).json({ error:`Role ${role} not found.`});
      }
      const roleId = roleRecord.id;

      
      const currentPermissions = await ChatPermissionModel.findAll({
        where: {
          chat_id: chatId,
          role_id: roleId,
        },
      });

      
      const currentPermissionNames = await Promise.all(
        currentPermissions.map(async (permission) => {
          const permRecord = await PermissionModel.findByPk(permission.permission_id);
          return permRecord ? permRecord.name : null;
        })
      );

      
      const permissionsToAdd = newPermissions.filter(
        (perm) => !currentPermissionNames.includes(perm)
      );
      const permissionsToRemove = currentPermissionNames.filter(
        (perm) => !newPermissions.includes(perm)
      );

      
      for (const permissionName of permissionsToAdd) {
        const permissionRecord = await PermissionModel.findOne({
          where: { name: permissionName },
        });
        if (permissionRecord) {
          await ChatPermissionModel.findOrCreate({
            where: {
              chat_id: chatId,
              role_id: roleId,
              permission_id: permissionRecord.id,
            },
          });
        }
      }

      
      for (const permissionName of permissionsToRemove) {
        const permissionRecord = await PermissionModel.findOne({
          where: { name: permissionName },
        });
        if (permissionRecord) {
          await ChatPermissionModel.destroy({
            where: {
              chat_id: chatId,
              role_id: roleId,
              permission_id: permissionRecord.id,
            },
          });
        }
      }
    }

    return res.status(200).json({ message: "Roles and permissions updated successfully." });
  } catch (error) {
    console.error("Error updating roles and permissions:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating roles and permissions." });
  }
};

// In your controller file

export const leaveChat = async (req, res) => {
  console.log(req.body);
  const { chatId,userId } = req.params;

  try {
    
    const chatMember = await ChatMembersModel.findOne({
      where: { chat_id: chatId, user_id: userId },
    });

    if (!chatMember) {
      return res.status(404).json({ message: "User not found in the chat" });
    }

    
    await ChatMembersModel.destroy({
      where: { chat_id: chatId, user_id: userId },
    });

    return res.status(200).json({ message: "User successfully left the chat" });
  } catch (error) {
    console.error("Error leaving chat:", error);
    return res.status(500).json({ message: "Failed to leave chat" });
  }
};
