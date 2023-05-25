"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistedToken = void 0;
const mongoose_1 = require("mongoose");
const BlacklistedTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});
exports.BlacklistedToken = (0, mongoose_1.model)('BlacklistedToken', BlacklistedTokenSchema, 'blacklistedTokensCollection');
