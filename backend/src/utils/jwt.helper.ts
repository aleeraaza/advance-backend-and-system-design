import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/config.js";
import { IJWTPayload } from "../types/auth.types.js";

export const generateAccessToken = (payload: IJWTPayload) => {
  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (payload: IJWTPayload) => {
  return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as IJWTPayload;
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
};
