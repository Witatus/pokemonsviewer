"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearBlacklist = exports.addLoginAction = void 0;
const auth_1 = require("../models/auth");
const addLoginAction = (action) => {
    return (req, _res, next) => {
        console.log(req.headers);
        req.body.loginAction = action;
        next();
    };
};
exports.addLoginAction = addLoginAction;
const clearBlacklist = async () => {
    const currentDate = new Date();
    setInterval(async () => {
        await auth_1.BlacklistedToken.deleteMany({ expiresAt: { $lte: currentDate } }).exec();
    }, 1000 * 60 * 60); // 1 hour
};
exports.clearBlacklist = clearBlacklist;
