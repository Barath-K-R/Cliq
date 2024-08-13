import express from 'express'
import { createChat, findChat, userChats } from '../controllers/ChatController.js';
import { getUserChats ,creatingChat,createGroupchat,getChatMembers} from '../mysqlControllers/chatController.js';
const chatRouter = express.Router()

chatRouter.post('/', creatingChat);
chatRouter.post('/groupchat',createGroupchat)
chatRouter.get('/:userId', getUserChats);
chatRouter.get('/:chatId/members',getChatMembers);
chatRouter.get('/find/:firstId/:secondId', findChat);

export default chatRouter 