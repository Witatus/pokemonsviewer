"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verified: { type: Boolean, default: false },
    joinDate: { type: Date, default: Date.now }
});
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt_1.default.hash(this.password, 12);
    }
    next();
});
UserSchema.methods.comparePassword = function (password) {
    return bcrypt_1.default.compare(password, this.password);
};
exports.User = (0, mongoose_1.model)('User', UserSchema, "usersCollection");
