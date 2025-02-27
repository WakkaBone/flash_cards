import { Router } from "express";
import {
  loginController,
  logoutController,
  checkAuthController,
  signupController,
} from "../controllers/auth";
import { isAuth } from "../middleware";
import { loginValidator, signupValidator } from "../validators";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/logout", logoutController);
router.post("/check-auth", isAuth, checkAuthController);
router.post("/signup", signupValidator, signupController);

export default router;
