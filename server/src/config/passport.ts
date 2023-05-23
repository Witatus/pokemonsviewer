import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifiedCallback,
} from "passport-jwt";
import { PassportStatic } from "passport";
import { IUser, User } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { BlacklistedToken, IBlacklistedToken } from "../models/auth";

export const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};


const initializePassport = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(
      opts,
      async (req: Request, jwtPayload: any, done: VerifiedCallback) => {
        try {
          if (req.body.loginAction) {
            req.body.expiresAt = jwtPayload.exp;
          }
          const blacklistedToken = await BlacklistedToken.findOne({
            token: req.headers.authorization?.split(" ")[1],
          });

          if (blacklistedToken) {
            return done(null, false);
          }
          const user: IUser | null = await User.findOne({
            name: jwtPayload.name,
          });

          console.log("user", user)
          if (user) {
            req.body.role = user.role;
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export default initializePassport;
