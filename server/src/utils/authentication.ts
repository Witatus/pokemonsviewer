import { Request, Response, NextFunction } from "express";
import { BlacklistedToken } from "../models/auth";

export const addLoginAction = (action: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log(req.headers);
    req.body.loginAction = action;
    next();
  };
};

export const clearBlacklist = async () => {
  const currentDate = new Date();
  setInterval(async () => {
    await BlacklistedToken.deleteMany({ expiresAt: { $lte: currentDate } }).exec();
  }, 1000 * 60 *60); // 1 hour
};
