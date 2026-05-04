import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/config.js";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
};
