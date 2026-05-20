import { z } from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(2, "Username is required"),
  email: z.email("Email is required"),
  password: z.string().min(6, "Password must be 6 characters long"),
});

export const loginUserSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().min(6, "Password must be 6 characters long"),
});

export type LoginUserDTO = z.infer<typeof loginUserSchema>;
export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
