"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = exports.protectedRoute = exports.updateUserPassword = exports.checkIfTokenIsBlacklisted = exports.logoutUser = exports.loginUser = exports.deleteUser = exports.getUserByName = exports.getAllUsers = exports.signUpUser = void 0;
const user_1 = require("../models/user");
const auth_1 = require("../models/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const deep_email_validator_1 = __importDefault(require("deep-email-validator"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const signUpUser = async (req, res) => {
    console.log(req.body);
    try {
        const existingUser = await user_1.User.findOne({
            name: req.body.name,
        });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const userWithExistingEmail = await user_1.User.findOne({
            email: req.body.email,
        });
        if (userWithExistingEmail) {
            return res.status(400).json({ msg: "Email already used" });
        }
        if (!(await (0, deep_email_validator_1.default)(req.body.email)).validators.regex) {
            return res.status(400).json({ msg: "Invalid email" });
        }
        const date = new Date();
        const newUser = new user_1.User({
            name: req.body.name,
            password: req.body.password,
            date: date,
            email: req.body.email,
            role: req.body.role || "user",
        });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.signUpUser = signUpUser;
const getAllUsers = async (_req, res) => {
    try {
        const users = await user_1.User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserByName = async (req, res) => {
    try {
        const user = await user_1.User.findOne({ name: req.params.name });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getUserByName = getUserByName;
const deleteUser = async (req, res) => {
    try {
        const user = await user_1.User.findOne({ name: req.params.name });
        if (!user) {
            return res.status(404).send("User not found");
        }
        await user.deleteOne();
        res.status(200).json({ message: `User ${req.params.name} deleted` });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteUser = deleteUser;
const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await user_1.User.findOne({ name });
        if (!user) {
            return res.status(401).send("Invalid username or password");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }
        const payload = {
            id: user._id,
            name: user.name,
            role: user.role,
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "secret_key", { expiresIn: "1h" }, (error, token) => {
            if (error)
                throw error;
            res.status(200).json({ token });
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    console.log("logging out");
    try {
        if (req.headers.authorization) {
            const extractedToken = req.headers.authorization.split(" ")[1];
            const decodedToken = (0, jwt_decode_1.default)(extractedToken);
            if (!decodedToken.exp) {
                return res.status(400).send("No token expiration provided");
            }
            const newBlacklistedToken = new auth_1.BlacklistedToken({
                token: extractedToken,
                expiresAt: decodedToken.exp * 1000,
            });
            await newBlacklistedToken.save();
            return res.status(200).send("logged out");
        }
        else {
            return res.status(401).send("No token provided");
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.logoutUser = logoutUser;
const checkIfTokenIsBlacklisted = async (req, res) => {
    try {
        console.log(req.body);
        const blacklistedToken = await auth_1.BlacklistedToken.findOne({
            token: req.body.token,
        });
        console.log(blacklistedToken);
        if (blacklistedToken) {
            return res.status(401).send("Token is blacklisted");
        }
        else {
            return res.status(200).send("Token is not blacklisted");
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.checkIfTokenIsBlacklisted = checkIfTokenIsBlacklisted;
const updateUserPassword = async (req, res) => {
    try {
        const user = await user_1.User.findOne({ name: req.params.name });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const oldPassword = user.password;
        if (oldPassword === req.body.newPassword) {
            res
                .status(400)
                .json({ message: "Old password is the same as old password" });
        }
        else {
            user.password = req.body.newPassword;
            await user.save();
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateUserPassword = updateUserPassword;
const protectedRoute = async (req, res) => {
    try {
        res.send(`Hello, user ${req.body.name}!`);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.protectedRoute = protectedRoute;
const adminRoute = async (req, res) => {
    try {
        if (req.body.role !== "admin") {
            return res.status(403).send("Unauthorized");
        }
        res.send(`Hello, user ${req.body.name}!`);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.adminRoute = adminRoute;
