import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config/config.js";
import authRouter from "./modules/auth/auth.route.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);

app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Successs health checkutp",
  });
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundHandler);

app.use(globalErrorHandler);
