import { Router } from "express";
import { deleteUser, getCurrentUserData, UpdateUser } from "../controllers/users.controller";
import userAuth from "../middlewares/userAuthorization";
import checkValidId from "../middlewares/checkId";
const userDataRouter = Router();
userDataRouter.get("/", userAuth, getCurrentUserData);
userDataRouter.put("/:id", checkValidId ,UpdateUser);
userDataRouter.delete("/:id", checkValidId, deleteUser);
export default userDataRouter
