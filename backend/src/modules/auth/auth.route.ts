import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(validate(registerUserSchema), authController.registerController);

authRouter
  .route("/login")
  .post(validate(loginUserSchema), authController.loginController);

export default authRouter;
