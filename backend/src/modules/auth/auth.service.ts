import { IAuthRepository } from "../../types/auth.interface.js";
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
import type {
  LoginUserDTO,
  RefreshTokenDTO,
  RegisterUserDTO,
} from "./auth.schema.js";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async registerUserService(body: RegisterUserDTO) {
    const { email, password, username } = body;

    const existingUserByUsername =
      await this.authRepository.findUserByUsername(username);

    if (existingUserByUsername) {
      throw new AppError("User already exists", 400);
    }
    const existingUserByEmail =
      await this.authRepository.findUserByEmail(email);

    if (existingUserByEmail) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.authRepository.createUser({
      username,
      email,
      hashedPassword,
    });

    const accessToken = generateAccessToken({ userId: newUser.id });
    const refreshToken = generateRefreshToken({ userId: newUser.id });

    const hashedToken = hashRefreshToken(refreshToken);

    await this.authRepository.createRefreshToken({
      token: hashedToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
    };
  }

  async loginUserService(body: LoginUserDTO) {
    const { email, password } = body;
    const user = await this.authRepository.findUserByEmail(email);
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

    await this.authRepository.createRefreshToken({
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshTokenService(token: string) {
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
    const existingToken = await this.authRepository.findRefreshToken(hashToken);
    if (!existingToken) {
      throw new AppError("Refresh token not found!", 404);
    }

    await this.authRepository.deleteRefreshToken(existingToken.id);

    const newAccessToken = generateAccessToken({ userId: decoded.userId });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId });

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await this.authRepository.createRefreshToken({
      token: newRefreshTokenHash,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUserService(body: IJWTPayload) {
    const { userId } = body;
    const user = await this.authRepository.getCurrentUser(userId);

    return {
      user,
    };
  }

  async logoutService(token: string) {
    if (!token) {
      throw new AppError("Refresh Token is required", 401);
    }

    const hashedRefreshToken = hashRefreshToken(token);

    const existingToken =
      await this.authRepository.findRefreshToken(hashedRefreshToken);
    if (!existingToken) {
      throw new AppError("Token not Found!", 404);
    }

    await this.authRepository.deleteRefreshToken(existingToken.id);

    return true;
  }

  async logoutAllService(userId: string) {
    if (!userId) {
      throw new AppError("UserId is required", 401);
    }

    await this.authRepository.deleteAllRefreshTokensByUserId(userId);

    return true;
  }
}
