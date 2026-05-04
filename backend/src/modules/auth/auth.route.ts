import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerUserSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(validate(registerUserSchema), authController);

export default authRouter;
