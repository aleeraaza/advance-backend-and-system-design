import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import { AppError } from "../utils/AppError.js";

export function verifyTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError("Authorization header missing", 401);
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Invalid authorization format", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Invalid or Missing Access Token!", 401);
  }
  const decoded = verifyAccessToken(token);

  req.user = {
    userId: decoded.userId,
  };

  next();
}
