import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const authController = {
  registerController: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUserService(req.body);
    return sendResponse(res, 201, {
      success: true,
      message: "Account Created Successfully",
      data: result,
    });
  }),
  loginController: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUserService(req.body);
    return sendResponse(res, 200, {
      success: true,
      message: "User Logged In Successfully",
      data: result,
    });
  }),
};
