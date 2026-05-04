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

  createUser: async (
    username: string,
    email: string,
    hashedPassword: string,
  ) => {
    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return createdUser;
  },

  refreshToken: async (data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) => {
    await prisma.refreshToken.create({
      data,
    });
  },
};
