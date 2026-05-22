import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(404).json({
    status: false,
    message: `Rout ${req.originalUrl} not found!`,
  });
};
