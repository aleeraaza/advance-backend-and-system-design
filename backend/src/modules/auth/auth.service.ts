import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/auth.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.helper.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import type { RegisterUserDTO } from "./auth.schema.js";

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

    const newUser = await authRepository.createUser(
      email,
      username,
      hashedPassword,
    );

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    await authRepository.refreshToken({
      token: refreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
    };
  },
};
