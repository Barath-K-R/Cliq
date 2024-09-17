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
      attributes: ["id", "chat_id", "sender_id", "message","createdAt"],
    });

    res.send(messages);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).send("An error occurred while fetching chat messages.");
  }
};

export const addReadReciept = async (req, res) => {
  const { message_id, userIds,date} = req.body;

  try {
    const readReceipts = userIds.map((userId) => ({
      message_id,
      user_id: userId,
      seen_at:date
    }));
    const newReadReciepts = await ReadRecieptModel.bulkCreate(readReceipts);
    res.send(newReadReciepts);
  } catch (error) {
    console.log(error);
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
