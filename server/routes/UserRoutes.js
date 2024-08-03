import express from 'express';
import { addUser,loginUser,getUser} from '../controllers/UserController.js';
const UserRouter=express.Router();

UserRouter.post('/',addUser);
UserRouter.get('/:id',getUser);
UserRouter.post('/login',loginUser);

export default UserRouter