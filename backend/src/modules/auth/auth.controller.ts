import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const authController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.registerUserService(req.body);
    return sendResponse(res, 201, {
      success: true,
      message: "Account Created Successfully",
      data: result,
    });
  },
);
