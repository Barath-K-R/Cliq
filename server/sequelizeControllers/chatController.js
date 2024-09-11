import ChatModel from "../models/ChatModel.js";
import ChatMembersModel from "../models/ChatMembersModel.js";
import UserModel from "../models/UserModel.js";
import { Op } from "sequelize";
import sequelize from "../config/sequelizeConfig.js";

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
    if (chatType === "direct") {
      console.log("DIRECT");

      // Check if the direct chat already exists
      const existingChat = await ChatModel.findOne({
        where: {
          chat_type: chatType,
          id: {
            [Op.in]: sequelize.literal(`(
              SELECT chat_id 
              FROM chat_members 
              WHERE user_id = ${sequelize.escape(currentUserId)}
            )`),
          },
        },
        include: [
          {
            model: UserModel,
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
        ],
      });

      console.log(existingChat);
      if (!existingChat) {
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
      } else {
        res.send(existingChat);
      }
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
        user_id: user.id,
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
  console.log('getting current chats')
  try {
    const type = req.query.type;
    const { userId } = req.params;
    console.log(type+' '+userId)
    console.log(type);
    if (!type || !userId) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    let chats;
    if (type === "direct") {
      console.log("Fetching direct chats");

      chats =await ChatMembersModel.findAll({
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
    }
    else{
      chats= await ChatMembersModel.findAll({
        attributes: ['chat_id'],
        include: [
          {
            model: ChatModel,
            attributes: ['name'],
            where: { chat_type: type }, 
          },
        ],
        where: {
          user_id: userId, // Filter by user ID
        },
      });
    }

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
        {
          model: ChatModel,
          attributes: ["id", "name"],
        },
      ],
      attributes: ["chat_id", "user_id", "role", "joined_at"],
    });

    res.send(chatMembers);
  } catch (err) {
    console.error("Error fetching chat members:", err);
    res.status(500).send("Couldn't retrieve the members.");
  }
};
