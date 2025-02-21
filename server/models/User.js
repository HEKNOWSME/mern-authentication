"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: "" },
    otpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" },
    resetExpireAt: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
});
userSchema.methods.generateToken = function () {
    if (process.env.JWT_SECRET_KEY)
        return jsonwebtoken_1.default.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15min"
        });
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.UserModel = UserModel;
