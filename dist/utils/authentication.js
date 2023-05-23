"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "secret");
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(400).send("Invalid token.");
    }
}
exports.auth = auth;
