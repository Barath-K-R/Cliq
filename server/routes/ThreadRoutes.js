import express from "express";
import { createThread,addThreadMembers} from "../mysqlControllers/ThreadController.js";
const ThreadRouter = express.Router();

ThreadRouter.post('/',createThread)
ThreadRouter.post('/members', addThreadMembers);
export default ThreadRouter;
