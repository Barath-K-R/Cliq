import express from "express";
import { createThread,addMessageToThread} from "../sequelizeControllers/ThreadController.js";
const ThreadRouter = express.Router();

ThreadRouter.post('/',createThread)
ThreadRouter.post('/message', addMessageToThread);
export default ThreadRouter;
