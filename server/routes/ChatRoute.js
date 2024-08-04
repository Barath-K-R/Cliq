import express from 'express'
import { createChat, findChat, userChats } from '../controllers/ChatController.js';
import { getUserChats ,creatingChat} from '../mysqlControllers/chatController.js';
const chatRouter = express.Router()

chatRouter.post('/', creatingChat);
chatRouter.get('/:userId', getUserChats);
chatRouter.get('/find/:firstId/:secondId', findChat);

export default chatRouter 