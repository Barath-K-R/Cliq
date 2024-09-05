import express from "express";
import {
  getCurrentUserChats,
  createChat,
  createGroupchat,
  getChatMembers,
} from "../mysqlControllers/chatController.js";
import {createChatSequelize,getCurrentUserChatsSequelize,getChatMembersSequelize} from '../sequelizeControllers/chatController.js'
const chatRouter = express.Router();

chatRouter.post("/", createChatSequelize);
chatRouter.post("/groupchat", createGroupchat);
chatRouter.get("/:userId", getCurrentUserChatsSequelize);
chatRouter.get("/:chatId/members", getChatMembersSequelize);

export default chatRouter;
