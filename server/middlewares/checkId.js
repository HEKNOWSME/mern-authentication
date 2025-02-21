"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const checkValidId = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(400).send("Invalid Id");
            return;
        }
        next();
    }
    catch (error) {
        res.status(400).send(error.message);
        return;
    }
};
exports.default = checkValidId;
