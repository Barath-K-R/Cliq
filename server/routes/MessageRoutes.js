import express from "express";
import {
  addingMessage,
  getChatMessages,
  getGroupChatMessages,
} from "../mysqlControllers/messageController.js";
import {addingMessageSequelize,getChatMessagesSequelize} from '../sequelizeControllers/messageController.js'
const messageRouter = express.Router();

messageRouter.post("/", addingMessageSequelize);
messageRouter.get("/:chatId", getChatMessagesSequelize);
messageRouter.get("/:groupchatId", getGroupChatMessages);

export default messageRouter;
