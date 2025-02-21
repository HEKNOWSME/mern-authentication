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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUser = exports.getCurrentUserData = exports.deleteUser = void 0;
const User_1 = require("../models/User");
const getCurrentUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const users = yield User_1.UserModel
        .findById(_id)
        .select("username email isVerified -_id");
    res.send(users);
});
exports.getCurrentUserData = getCurrentUserData;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Check deleted");
});
exports.deleteUser = deleteUser;
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Check update");
});
exports.UpdateUser = UpdateUser;
