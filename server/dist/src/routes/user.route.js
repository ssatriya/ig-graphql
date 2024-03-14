import express from "express";
import { googleLoginCallbackController, googleLoginController, logoutController, userSessionController, } from "../controllers/user.controller.js";
import { authenticated } from "../middleware/authenticated.js";
const userRouter = express.Router();
userRouter.get("/login/google", googleLoginController);
userRouter.get("/login/google/callback", googleLoginCallbackController);
userRouter.post("/user/logout", authenticated, logoutController);
userRouter.get("/user/session", authenticated, userSessionController);
export default userRouter;
