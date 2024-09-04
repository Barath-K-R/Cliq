import express from 'express';
import { addingMessage ,getChatMessages,getGroupChatMessages} from '../mysqlControllers/messageController.js';
const messageRouter = express.Router();

messageRouter.post('/', addingMessage);

messageRouter.get('/:chatId', getChatMessages);
messageRouter.get('/:groupchatId', getGroupChatMessages);

export default messageRouter