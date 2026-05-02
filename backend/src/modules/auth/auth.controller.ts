import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";

export const authController = catchAsync(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    res.status(200).json({
      status: "success",
      data: {
        username,
        email,
      },
    });
  },
);
