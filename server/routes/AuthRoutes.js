import express from 'express';
import { loginUser,logout,createAccessToken} from '../sequelizeControllers/authController.js';
import verifyToken from '../middleware/verifyToken.js'

const AuthRouter = express.Router();

AuthRouter.post("/login", loginUser);
AuthRouter.post("/logout", logout);
AuthRouter.post('/refresh',createAccessToken);


export default AuthRouter;