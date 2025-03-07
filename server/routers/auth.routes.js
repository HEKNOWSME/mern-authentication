"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_authenticate_1 = __importDefault(require("../middlewares/auth.authenticate"));
const userAuthorization_1 = __importDefault(require("../middlewares/userAuthorization"));
const userRouter = (0, express_1.Router)();
userRouter.post("/register", auth_controller_1.registerUser);
userRouter.post("/auth", auth_controller_1.loginUser);
userRouter.post("/sendOtp", userAuthorization_1.default, auth_controller_1.sendOtp);
userRouter.post("/sendResetOtp", auth_controller_1.sendResetOtp);
userRouter.post("/verifyEmail", userAuthorization_1.default, auth_controller_1.verifyEmail);
userRouter.post("/verifyOtp", auth_controller_1.verifyPasswordOtp);
userRouter.post("/reset", auth_controller_1.resetPassword);
userRouter.post("/logout", auth_authenticate_1.default, auth_controller_1.logoutUser);
userRouter.get("/auth", auth_controller_1.isLogged);
exports.default = userRouter;
