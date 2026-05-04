import { UserResponseType } from "../../types/auth.types.js";

export function toUserResponse(user: UserResponseType) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
