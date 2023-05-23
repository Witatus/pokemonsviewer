import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  role: string;
  joinDate: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
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
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};


export const User =  model<IUser>('User', UserSchema, "usersCollection");