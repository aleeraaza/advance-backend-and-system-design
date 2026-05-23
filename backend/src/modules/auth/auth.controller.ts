import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { IJWTPayload } from "../../types/auth.types.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";

export const authController = {
  registerController: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUserService(req.body);
    setCookies(res, result.accessToken, result.refreshToken);
    return sendResponse(res, 201, {
      success: true,
      message: "Account Created Successfully",
      data: result,
    });
  }),

  loginController: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUserService(req.body);
    setCookies(res, result.accessToken, result.refreshToken);
    return sendResponse(res, 200, {
      success: true,
      message: "User Logged In Successfully",
      data: result,
    });
  }),

  refreshTokenController: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.refreshTokenService(
      req.cookies.refreshToken,
    );
    setCookies(res, result.accessToken, result.refreshToken);
    return sendResponse(res, 200, {
      success: true,
      message: "Token refreshed Successfully!",
      data: result,
    });
  }),

  userController: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.getCurrentUserService(
      req.user as IJWTPayload,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "User Data fetched Successfully!",
      data: result,
    });
  }),

  logoutController: catchAsync(async (req: Request, res: Response) => {
    await authService.logoutService(req.cookies.refreshToken);
    destroyCookies(res);
    return sendResponse(res, 200, {
      success: true,
      message: "User Logged out successfully",
    });
  }),

  logoutAllController: catchAsync(async (req: Request, res: Response) => {
    await authService.logoutAllService(req.user?.userId as string);
    destroyCookies(res);
    return sendResponse(res, 200, {
      success: true,
      message: "User Logged Out from All Devices Successfully!",
    });
  }),
};
