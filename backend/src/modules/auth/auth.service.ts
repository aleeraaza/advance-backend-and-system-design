import { AppError } from "../../utils/AppError.js";
import { hashPassword, hashRefreshToken } from "../../utils/auth.helper.js";
import { comparePassword } from "../../utils/helpers.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.helper.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import type { LoginUserDTO, RegisterUserDTO } from "./auth.schema.js";

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

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

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

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

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
};
