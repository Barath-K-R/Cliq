import express from "express";

import {addingMessageSequelize,getChatMessagesSequelize,addReadReciept,updateReadReciepts} from '../sequelizeControllers/messageController.js'
const messageRouter = express.Router();

messageRouter.post("/", addingMessageSequelize);
messageRouter.get("/:chatId", getChatMessagesSequelize);
messageRouter.post("/readreciepts",addReadReciept);
messageRouter.post("/readreciepts/update",updateReadReciepts);


export default messageRouter;
