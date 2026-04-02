import express from "express";
import {
  googleAuth,
  login,
  logout,
  me,
  signupStart,
  signupVerify,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup/start", signupStart);
authRouter.post("/signup/verify", signupVerify);
authRouter.post("/login", login);
authRouter.post("/google", googleAuth);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);

export default authRouter;
