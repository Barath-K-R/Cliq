import MessageModel from '../models/MessageModel.js'
import UserModel from '../models/UserModel.js'
export const addingMessageSequelize = async (req, res) => {
    console.log("Adding message");
    console.log(req.body)
    const { chatId, senderId, message } = req.body;
  
    try {
      const newMessage = await MessageModel.create({
        chat_id: chatId,
        sender_id: senderId,
        message: message,
      });
      const insertedMessage = await MessageModel.findOne({
        where: { id: newMessage.id },
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
        ],
        attributes: ["id", "chat_id", "sender_id", "message"], 
      });
  
      res.send(messages);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      res.status(500).send("An error occurred while fetching chat messages.");
    }
  };