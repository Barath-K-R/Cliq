import express from "express";
import {
  getCurrentUserChats,
  createChat,
  createGroupchat,
  getChatMembers,
} from "../mysqlControllers/chatController.js";
const chatRouter = express.Router();

chatRouter.post("/", createChat);
chatRouter.post("/groupchat", createGroupchat);
chatRouter.get("/:userId", getCurrentUserChats);
chatRouter.get("/:chatId/members", getChatMembers);

export default chatRouter;
