import { prisma } from "../../lib/prisma.js";

export const authRepository = {
  findUserByUsername: async (username: string) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  },

  findUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  },

  createUser: async (data: {
    username: string;
    email: string;
    hashedPassword: string;
  }) => {
    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.hashedPassword,
      },
    });
  },

  createRefreshToken: async (data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) => {
    return await prisma.refreshToken.create({
      data,
    });
  },

  findRefreshToken: async (token: string) => {
    return await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
  },

  deleteRefreshToken: async (id: string) => {
    return await prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  },

  deleteAllRefreshTokensByUserId: async (userId: string) => {
    return await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  },

  getCurrentUser: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  },
};
