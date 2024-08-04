import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";

import chatRouter from "./routes/ChatRoute.js";
import UserRouter from "./routes/UserRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";
const app = express();


// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();

connectDB();
app.listen(5000,()=>{
    console.log('server running successfully on port 5000');
})
app.use('/chat',chatRouter);
app.use('/message',messageRouter);
app.use('/user',UserRouter);

