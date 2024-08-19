import express from 'express';
import { addUser,loginUser,getUser} from '../controllers/UserController.js';
import { addingUser,logingUser,gettingUser} from '../mysqlControllers/userController.js';
const UserRouter=express.Router();

UserRouter.post('/',addingUser);
UserRouter.get('/:id',gettingUser);
UserRouter.post('/login',logingUser);
UserRouter.get('/org/:orgId')

export default UserRouter