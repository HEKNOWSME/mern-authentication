"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = validateUser;
exports.ValidateLogin = ValidateLogin;
exports.ValidateOtp = ValidateOtp;
const joi_1 = __importDefault(require("joi"));
function validateUser(user) {
    return joi_1.default.object({
        username: joi_1.default.string().required(),
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }).validate(user);
}
function ValidateLogin(user) {
    return joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }).validate(user);
}
function ValidateOtp(user) {
    return joi_1.default.object({
        userId: joi_1.default.string().required(),
    }).validate(user);
}
