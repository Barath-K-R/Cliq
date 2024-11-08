import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createChatSequelize,
  getCurrentUserChatsSequelize,
  removeMembersFromChat,
  getChatMembersSequelize,
  getRolePermissions,
  addMembersToChat,
  addRolePermissions, 
  getAllRolePermissions,
  deleteChat,
  leaveChat
} from "../sequelizeControllers/chatController.js";
const chatRouter = express.Router();

chatRouter.post("/", verifyToken, createChatSequelize);
chatRouter.get("/:userId", verifyToken, getCurrentUserChatsSequelize);
chatRouter.delete("/:chatId", verifyToken, deleteChat);
chatRouter.get("/:chatId/members", verifyToken, getChatMembersSequelize);
chatRouter.post("/:chatId/members", verifyToken, addMembersToChat);
chatRouter.delete("/:chatId/members", verifyToken, removeMembersFromChat);
chatRouter.delete("/:chatId/leave/:userId",leaveChat)

chatRouter.post("/:chatId/permissions", verifyToken, addRolePermissions);
chatRouter.get("/:chatId/permissions", verifyToken, getAllRolePermissions);
chatRouter.get("/:chatId/permissions/:roleId", verifyToken, getRolePermissions);


export default chatRouter;