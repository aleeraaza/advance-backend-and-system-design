import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  refreshtokenSchema,
  registerUserSchema,
} from "./auth.schema.js";
import { verifyTokenHandler } from "../../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(validate(registerUserSchema), authController.registerController);

router
  .route("/login")
  .post(validate(loginUserSchema), authController.loginController);

router
  .route("/refresh-token")
  .post(validate(refreshtokenSchema), authController.refreshTokenController);

router.route("/me").get(verifyTokenHandler, authController.userController);

router
  .route("/logout")
  .post(verifyTokenHandler, authController.logoutController);

router
  .route("/logout-all")
  .post(verifyTokenHandler, authController.logoutAllController);

export default router;
