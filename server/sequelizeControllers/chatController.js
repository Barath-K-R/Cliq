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

  console.log(userIds);
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

    console.log("finished");

    if (chatExists.length > 0)
      res.send({ message: "chat already exits", chatExists });

    if (chatType === "direct") {
      console.log("DIRECT");
      // Create new chat
      const newChat = await ChatModel.create({
        chat_type: chatType,
      });

      // Add members to the chat
      await ChatMembersModel.bulkCreate([
        { chat_id: newChat.id, user_id: currentUserId },
        { chat_id: newChat.id, user_id: userIds[0] },
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

      res.send({
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

      console.log(newGroup);
      // Add members to the chat
      const groupMembers = userIds.map((user) => ({
        chat_id: newGroup.id,
        user_id: user,
      }));
      groupMembers.push({ chat_id: newGroup.id, user_id: currentUserId });

      await ChatMembersModel.bulkCreate(groupMembers);

      const newGroupWithMembers = await ChatModel.findOne({
        where: { id: newGroup.id },
        attributes: ["id", "name"],
      });

      res.send({
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
      }));
      channelMembers.push({ chat_id: newChannel.id, user_id: currentUserId });

      await ChatMembersModel.bulkCreate(channelMembers);

      const newChannelWithMembers = await ChatModel.findOne({
        where: { id: newChannel.id },
        attributes: ["id", "name"],
      });

      res.send({
        newChat: newChannelWithMembers,
        message: "New chat created and users were added successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
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
    res.send(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).send({ error: "Internal Server Error" });
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
      res.status(404).send("chat not found");
    }

    // Validate if the users exist
    const users = await UserModel.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      res.status(404).send("One or more users not found");
    }

    const groupIds = userIds.map((id) => {
      return { chat_id: chatId, user_id: id };
    });
    const newMembers = await ChatMembersModel.bulkCreate(groupIds);
    res.send(newMembers);
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
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};
