import { Router } from "express";
import { loginController, logoutController } from "../controllers/auth";
import { loginValidator } from "../validators";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/logout", logoutController);

export default router;
