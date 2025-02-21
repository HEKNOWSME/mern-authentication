"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(403).send("You are not Authenticated");
        return;
    }
    try {
        if (process.env.JWT_SECRET_KEY) {
            const decodedUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            if (!decodedUser || !decodedUser._id) {
                res.status(401).send("You are not Authorized");
                return;
            }
            req.user = decodedUser;
            req.body.userId = decodedUser._id;
            next();
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.default = userAuth;
