import express from "express";
import {createChatSequelize,getCurrentUserChatsSequelize,getChatMembersSequelize,getRolePermissions,addMembersToChat } from '../sequelizeControllers/chatController.js'
const chatRouter = express.Router();

chatRouter.post("/", createChatSequelize);
chatRouter.get("/:userId", getCurrentUserChatsSequelize);
chatRouter.get("/:chatId/members", getChatMembersSequelize);
chatRouter.post("/:chatId/members",addMembersToChat )

chatRouter.get('/:chatId/permissions/:roleId',getRolePermissions)

export default chatRouter;
