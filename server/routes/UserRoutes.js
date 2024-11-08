import express from "express";
import verifyToken from "../middleware/verifyToken.js";


import { addingUserSequelize,gettingUserSequelize,getAllOrgUsersSequelize} from "../sequelizeControllers/userController.js";
const UserRouter = express.Router();

UserRouter.post("/", verifyToken,addingUserSequelize);
UserRouter.get("/:id",verifyToken, gettingUserSequelize);
UserRouter.get("/org/:orgId",verifyToken, getAllOrgUsersSequelize);

export default UserRouter;
