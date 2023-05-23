"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = exports.updateUserPasword = exports.loginUser = exports.deleteUser = exports.getUserByName = exports.getAllUsers = exports.createUser = void 0;
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = async (req, res) => {
    try {
        const existingUser = await user_1.User.findOne({
            name: req.body.name,
        });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const date = new Date();
        const newUser = new user_1.User({
            name: req.body.name,
            password: req.body.password,
            date: date,
        });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createUser = createUser;
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
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "your_secret_key", { expiresIn: "1h" }, (error, token) => {
            if (error)
                throw error;
            res.json({ token });
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const updateUserPasword = async (req, res) => {
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
exports.updateUserPasword = updateUserPasword;
const protectedRoute = async (_req, res) => {
    try {
        res.status(200).json({ message: "hello" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.protectedRoute = protectedRoute;
