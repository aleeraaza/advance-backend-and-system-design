export interface UserResponseType {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJWTPayload {
  userId: string;
}
