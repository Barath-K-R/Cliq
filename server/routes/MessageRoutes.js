import express from "express";

import {addingMessageSequelize,getChatMessagesSequelize,addReadReciept} from '../sequelizeControllers/messageController.js'
const messageRouter = express.Router();

messageRouter.post("/", addingMessageSequelize);
messageRouter.get("/:chatId", getChatMessagesSequelize);
messageRouter.post("/readreciepts",addReadReciept)


export default messageRouter;
