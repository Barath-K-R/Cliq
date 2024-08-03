import express from 'express';
import { addMessage, getMessages } from '../controllers/MessageController.js';

const messageRouter = express.Router();

messageRouter.post('/', addMessage);

messageRouter.get('/:chatId', getMessages);

export default messageRouter