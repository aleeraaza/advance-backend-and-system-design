import { IJWTPayload } from "../../types/auth.types.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword, hashRefreshToken } from "../../utils/auth.helper.js";
import { comparePassword } from "../../utils/helpers.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.helper.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import type {
  LoginUserDTO,
  RefreshTokenDTO,
  RegisterUserDTO,
} from "./auth.schema.js";

export const authService = {
  registerUserService: async (body: RegisterUserDTO) => {
    const { email, password, username } = body;

    const existingUserByUsername =
      await authRepository.findUserByUsername(username);

    if (existingUserByUsername) {
      throw new AppError("User already exists", 400);
    }
    const existingUserByEmail = await authRepository.findUserByEmail(email);

    if (existingUserByEmail) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await authRepository.createUser({
      username,
      email,
      hashedPassword,
    });

    const accessToken = generateAccessToken({ userId: newUser.id });
    const refreshToken = generateRefreshToken({ userId: newUser.id });

    const hashedToken = hashRefreshToken(refreshToken);

    await authRepository.createRefreshToken({
      token: hashedToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
    };
  },

  loginUserService: async (body: LoginUserDTO) => {
    const { email, password } = body;
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("No User exists with this email!", 404);
    }

    const isPasswordMatch = await comparePassword({
      userPassword: password,
      hashedPassword: user.password,
    });

    if (!isPasswordMatch) {
      throw new AppError("User Password Invalid!", 401);
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const hashedToken = hashRefreshToken(refreshToken);

    await authRepository.createRefreshToken({
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  },

  refreshTokenService: async (body: RefreshTokenDTO) => {
    const { token } = body;
    if (!token) {
      throw new AppError("Refersh token is required", 401);
    }
    let decoded;
    try {
      decoded = verifyRefreshToken(token) as IJWTPayload;
    } catch {
      throw new AppError("Invalid or expired refresh token", 403);
    }

    const hashToken = hashRefreshToken(token);
    const existingToken = await authRepository.findRefreshToken(hashToken);
    if (!existingToken) {
      throw new AppError("Refresh token not found!", 404);
    }

    await authRepository.deleteRefreshToken(existingToken.id);

    const newAccessToken = generateAccessToken({ userId: decoded.userId });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId });

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await authRepository.createRefreshToken({
      token: newRefreshTokenHash,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  getCurrentUserService: async (body: IJWTPayload) => {
    const { userId } = body;
    const user = await authRepository.getCurrentUser(userId);

    return {
      user,
    };
  },
};
