import { Router } from "express";
import * as userController from "../controllers/userController";
import passport from 'passport';
import { addLoginAction } from "../utils/authentication";

const router = Router();

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  userController.protectedRoute
);
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.adminRoute
);
router.post("/login", userController.loginUser);
router.get("/logout", addLoginAction("logout"), passport.authenticate("jwt", { session: false }), userController.logoutUser);
router.put("/:name", userController.updateUserPassword);
router.post("/signup", userController.signUpUser);
router.get('/blacklist', userController.checkIfTokenIsBlacklisted)
export { router as usersAuthRouter };
