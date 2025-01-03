import express from "express";

import {
  addingMessageSequelize,
  getUnseenMessagesCount,
  getChatMessagesSequelize,
  addReadReceipt,
  updateReadReciepts,
  deleteChatMessages
} from "../sequelizeControllers/messageController.js";
const messageRouter = express.Router();

// For Messages
messageRouter.post("/", addingMessageSequelize);
messageRouter.get("/chats/:chatId", getChatMessagesSequelize);
messageRouter.delete('/chats/:chatId',deleteChatMessages)
messageRouter.get("/chats/:chatId/unseen", getUnseenMessagesCount);

// For Read Receipts
messageRouter.put("/read-reciepts", updateReadReciepts);
messageRouter.post(
  "/read-reciepts/:messageId",
  addReadReceipt
);


export default messageRouter;
