import express from 'express';
import { addMessage, getMessages } from '../controllers/MessageController.js';
import { addingMessage ,gettingMessages} from '../mysqlControllers/messageController.js';
const messageRouter = express.Router();

messageRouter.post('/', addingMessage);

messageRouter.get('/:chatId', gettingMessages);

export default messageRouter