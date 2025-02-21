"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const userAuthorization_1 = __importDefault(require("../middlewares/userAuthorization"));
const checkId_1 = __importDefault(require("../middlewares/checkId"));
const userDataRouter = (0, express_1.Router)();
userDataRouter.get("/", userAuthorization_1.default, users_controller_1.getCurrentUserData);
userDataRouter.put("/:id", checkId_1.default, users_controller_1.UpdateUser);
userDataRouter.delete("/:id", checkId_1.default, users_controller_1.deleteUser);
exports.default = userDataRouter;
