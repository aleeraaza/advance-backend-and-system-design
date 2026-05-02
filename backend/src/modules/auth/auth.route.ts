import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(authController);

export default authRouter;
