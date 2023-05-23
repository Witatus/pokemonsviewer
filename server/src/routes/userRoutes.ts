import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/:name", userController.getUserByName);
router.get("/", userController.getAllUsers);
router.delete("/:name", userController.deleteUser);

export { router as usersRouter };
