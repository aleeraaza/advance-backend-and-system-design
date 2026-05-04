import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({
  path: "./.env",
});

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || "4001";
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL || "3001";

export const JWT_ACCESS_TOKEN_SECRET = process.env
  .JWT_ACCESS_TOKEN_SECRET as string;
export const JWT_REFRESH_TOKEN_SECRET = process.env
  .JWT_REFRESH_TOKEN_SECRET as string;
