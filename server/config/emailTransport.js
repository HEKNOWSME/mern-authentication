"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const nodemailer_1 = require("nodemailer");
(0, dotenv_1.config)();
const transport = (0, nodemailer_1.createTransport)({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
exports.default = transport;
