import { Router } from "express";
import { isLogged, loginUser, logoutUser, registerUser, resetPassword, sendOtp, sendResetOtp, verifyEmail, verifyPasswordOtp } from "../controllers/auth.controller";
import auth from "../middlewares/auth.authenticate";
import userAuth from "../middlewares/userAuthorization";
const userRouter = Router();
userRouter.post("/register", registerUser);
userRouter.post("/auth", loginUser);
userRouter.post("/sendOtp", userAuth, sendOtp);
userRouter.post("/sendResetOtp" , sendResetOtp);
userRouter.post("/verifyEmail", userAuth, verifyEmail);
userRouter.post("/verifyOtp", verifyPasswordOtp);
userRouter.post("/reset", resetPassword);
userRouter.post("/logout", auth, logoutUser);
userRouter.get("/auth", isLogged)
export default userRouter