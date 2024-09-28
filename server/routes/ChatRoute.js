import express from "express";
import {createChatSequelize,getCurrentUserChatsSequelize,getChatMembersSequelize} from '../sequelizeControllers/chatController.js'
const chatRouter = express.Router();

chatRouter.post("/", createChatSequelize);
chatRouter.get("/:userId", getCurrentUserChatsSequelize);
chatRouter.get("/:chatId/members", getChatMembersSequelize);

export default chatRouter;
