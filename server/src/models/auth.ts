import { Document, Schema, model } from "mongoose";

export interface IBlacklistedToken extends Document {
    token: string;
    expiresAt: Date;
  }

const BlacklistedTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});

export const BlacklistedToken = model<IBlacklistedToken>('BlacklistedToken', BlacklistedTokenSchema,'blacklistedTokensCollection');
