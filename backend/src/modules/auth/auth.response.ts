import { z } from "zod";
import type { User } from "../../generated/prisma/client.js";

export const userResponseSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const authResponseSchema = z.object({
  user: userResponseSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type UserResponseDTO = z.infer<typeof userResponseSchema>;
export type AuthResponseDTO = z.infer<typeof authResponseSchema>;
