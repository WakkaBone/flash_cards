import { Router } from "express";
import {
  loginController,
  logoutController,
  checkAuthController,
  signupController,
  patchAccountController,
} from "../controllers/auth";
import { isAuth } from "../middleware";
import {
  loginValidator,
  patchAccountValidator,
  signupValidator,
} from "../validators";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/logout", logoutController);
router.post("/check-auth", isAuth, checkAuthController);
router.post("/signup", signupValidator, signupController);
router.patch("/account", patchAccountValidator, patchAccountController);

export default router;
