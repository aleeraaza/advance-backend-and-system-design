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
    await prisma.refreshToken.create({
      data,
    });
  },
};
