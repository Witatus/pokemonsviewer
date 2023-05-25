"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opts = void 0;
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../models/user");
const auth_1 = require("../models/auth");
exports.opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
};
const initializePassport = (passport) => {
    passport.use(new passport_jwt_1.Strategy(exports.opts, async (req, jwtPayload, done) => {
        try {
            if (req.body.loginAction) {
                req.body.expiresAt = jwtPayload.exp;
            }
            const blacklistedToken = await auth_1.BlacklistedToken.findOne({
                token: req.headers.authorization?.split(" ")[1],
            });
            if (blacklistedToken) {
                return done(null, false);
            }
            const user = await user_1.User.findOne({
                name: jwtPayload.name,
            });
            console.log("user", user);
            if (user) {
                req.body.role = user.role;
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
