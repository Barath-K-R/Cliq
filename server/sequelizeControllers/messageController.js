import MessageModel from "../models/MessageModel.js";
import UserModel from "../models/UserModel.js";
import ReadRecieptModel from "../models/ReadReceiptModel.js";
import { Op } from "sequelize";
export const addingMessageSequelize = async (req, res) => {
  console.log("Adding message");
  console.log(req.body);
  const { chatId, sender_id, message } = req.body;

  try {
    const newMessage = await MessageModel.create({
      chat_id: chatId,
      sender_id: sender_id,
      message: message,
    });
    const insertedMessage = await MessageModel.findOne({
      where: { id: newMessage.id },
      attributes: ["id", "chat_id", "thread_id", "sender_id", "message"],
    });
    res.send(insertedMessage);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).send("An error occurred while adding the message.");
  }
};

export const getChatMessagesSequelize = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await MessageModel.findAll({
      where: { chat_id: chatId },
      include: [
        {
          model: UserModel,
          attributes: ["username"],
        },
        {
          model: ReadRecieptModel,
          attributes: ["id", "user_id", "seen_at"],
        },
      ],
      attributes: ["id", "chat_id", "sender_id", "message", "createdAt"],
      order: [["createdAt", "ASC"]],
    });

    res.send(messages);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).send("An error occurred while fetching chat messages.");
  }
};

export const addReadReceipt = async (req, res) => {
  const { userIds, date } = req.body;
  const { messageId } = req.params;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: "User IDs are required and must be an array." });
  }

  if (!messageId) {
    return res.status(400).json({ error: "Message ID is required." });
  }

  try {
    const readReceipts = userIds.map((userId) => ({
      message_id: messageId,
      user_id: userId,
      seen_at: date,
    }));

    const newReadReceipts = await ReadRecieptModel.bulkCreate(readReceipts);
    res.status(201).json(newReadReceipts);
  } catch (error) {
    console.error("Error adding read receipts:", error);
    res.status(500).json({ error: "An error occurred while adding read receipts." });
  }
};


export const updateReadReciepts = async (req, res) => {
  const { messageIds, userId, date } = req.body;

  try {
    const updatedReadReciept = await ReadRecieptModel.update(
      { seen_at: date },
      {
        where: {
          message_id: {
            [Op.in]: messageIds,
          },
          user_id: userId,
        },
      }
    );

    res.status(200).json(updatedReadReciept);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to update read receipts");
  }
};

export const getUnseenMessagesCount = async (req, res) => {
  console.log('counting unseen messages')
  const {userId}=req.query
  const {chatId}=req.params
  try {
    const unseenReadReceipts = await ReadRecieptModel.count({
      where: {
        user_id: userId,  
        seen_at: null,     
      },
      include: [
        {
          model: MessageModel,
          where: {
            chat_id: chatId,
          },
          required: false,
        },
      ],
    });
    res.status(200).json({ unseenReadReceipts });
  } catch (error) {
    console.error("Error fetching unseen messages count:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching unseen messages count.",
      });
  }
};
