"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../models/user");
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const initializePassport = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, async (jwtPayload, done) => {
        try {
            const user = await user_1.User.findById(jwtPayload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        }
        catch (error) {
            return done(error, false);
        }
    }));
};
exports.default = initializePassport;
