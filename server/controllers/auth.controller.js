"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.isLogged = exports.verifyPasswordOtp = exports.sendResetOtp = exports.verifyEmail = exports.sendOtp = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailTransport_1 = __importDefault(require("../config/emailTransport"));
const User_1 = require("../models/User");
const user_validate_1 = require("../validations/user.validate");
const emailTemplate_1 = require("../config/emailTemplate");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_validate_1.validateUser)(req.body);
    const { username, email, password } = req.body;
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const existUser = yield User_1.UserModel.findOne({ email });
        if (existUser) {
            res.status(400).send("This email Is Taken Choose another one");
            return;
        }
        const hashPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newUser = yield new User_1.UserModel({ username, email, password: hashPassword }).save();
        const token = newUser.generateToken();
        res.cookie("token", token, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        }).send("User successful Registered");
        const mailOptions = {
            from: `Claudistack | full stack developer ${process.env.EMAIL_USER}`,
            to: email,
            subject: "Welcome to claudistack",
            text: `
         Dear ${username}!
         Welcome to Fullstack developer, Your Account Has been successful created with an email ${email} Please Consider Verify Your Account 
         `
        };
        yield emailTransport_1.default.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_validate_1.ValidateLogin)(req.body);
    const { email, password } = req.body;
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const user = yield User_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).send("Incorrect Email");
            return;
        }
        const comparePassword = yield (0, bcrypt_1.compare)(password, user.password);
        if (!comparePassword) {
            res.status(400).send("Incorrect password");
            return;
        }
        const token = user.generateToken();
        res.cookie("token", token, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        }).json({ message: "Login successful", userId: user._id });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    }).send("logout successful");
});
exports.logoutUser = logoutUser;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    if (!_id) {
        res.status(400).send("Provide user id");
        return;
    }
    try {
        const user = yield User_1.UserModel.findById(_id);
        if (!user) {
            res.status(400).send("No user found");
            return;
        }
        if (user.isVerified) {
            res.status(400).send("This Account Already verified");
            return;
        }
        const otp = Math.floor(Math.random() * 1000000).toString();
        const expireDate = Date.now() * 3 * 60 * 1000; // 3min
        yield user.updateOne({ verifyOtp: otp, otpExpireAt: expireDate });
        yield emailTransport_1.default.sendMail({
            from: `Claudistack | full stack developer ${process.env.EMAIL_USER}`,
            to: user.email,
            subject: "Welcome to claudistack",
            html: emailTemplate_1.EmailVerifyTemplate.replace("{{name}}", user.username).replace("{{otp}}", otp)
        });
        res.send(`OTP sent successful To ${user.email}`);
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.sendOtp = sendOtp;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        res.status(400).send("Enter userId And Otp");
        return;
    }
    try {
        const user = yield User_1.UserModel.findById(userId);
        if (!user) {
            res.status(400).send("The User does not exist");
            return;
        }
        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            res.status(400).send("Invalid Otp");
            return;
        }
        if (user.otpExpireAt < Date.now()) {
            res.status(400).send("OTP Expired Request New");
            return;
        }
        yield User_1.UserModel.findByIdAndUpdate(userId, { isVerified: true, otpExpireAt: 0, verifyOtp: "" });
        res.send("Successful Verified");
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.verifyEmail = verifyEmail;
const sendResetOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).send("Provide Your Email");
        return;
    }
    const resetOtp = Math.floor(Math.random() * 1000000).toString();
    const resetExpireAt = Date.now() * 3 * 60 * 1000;
    try {
        const user = yield User_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).send("Invalid Email");
            return;
        }
        user.resetOtp = resetOtp;
        user.resetExpireAt = resetExpireAt;
        yield user.save();
        const mailOptions = {
            from: `FullStack Web Developer | ${process.env.EMAIL_USER}`,
            to: user.email,
            subject: "OTP Reset Password",
            text: `
         Hello ${user.username} !
         Here is your Rest OTP To reset Your Password ${resetOtp}.`,
            date: Date.now().toString()
        };
        yield emailTransport_1.default.sendMail(mailOptions);
        res.send("OTP sent successfully");
    }
    catch (error) {
        res.status(400).send("Something Went Wrong");
    }
});
exports.sendResetOtp = sendResetOtp;
const verifyPasswordOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = req.body;
    if (!otp || !email) {
        res.status(400).send("Provide Your otp and email");
        return;
    }
    try {
        const user = yield User_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).send("user not Found");
            return;
        }
        ;
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            res.status(400).send("Invalid OTP");
            return;
        }
        if (user.resetExpireAt < Date.now()) {
            res.status(400).send("Reset Password Otp Expired Request New");
            return;
        }
        res.send("Change Your Password Now");
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.verifyPasswordOtp = verifyPasswordOtp;
const isLogged = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        res.status(403).send("You are not Authenticated");
        return;
    }
    try {
        if (process.env.JWT_SECRET_KEY) {
            const decodedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            if (!decodedUser) {
                res.status(401).send("You are not Authorized");
                return;
            }
        }
        res.json({ isLoggedIn: true });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.isLogged = isLogged;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, email } = req.body;
    if (!newPassword || !email) {
        res.status(400).send("Provide email and new password");
        return;
    }
    try {
        const user = yield User_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).send("user not Found");
            return;
        }
        ;
        const password = yield (0, bcrypt_1.hash)(newPassword, 10);
        user.password = password;
        user.resetExpireAt = 0;
        user.resetOtp = "";
        yield user.save();
        res.send("Password Successful Changed");
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.resetPassword = resetPassword;
