import { Router } from "express";
import {
  loginController,
  logoutController,
  checkAuthController,
} from "../controllers/auth";
import { loginValidator } from "../validators";
import { isAuth } from "../middleware";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/logout", logoutController);
router.post("/check-auth", isAuth, checkAuthController);

export default router;
