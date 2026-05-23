import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "../../types/auth.interface.js";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  }

  async createUser(data: {
    username: string;
    email: string;
    hashedPassword: string;
  }) {
    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.hashedPassword,
      },
    });
  }

  async createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    return await prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
  }

  async deleteRefreshToken(id: string) {
    return await prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllRefreshTokensByUserId(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async getCurrentUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
