export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any>;
  findUserByUsername(username: string): Promise<any>;

  createUser(data: {
    username: string;
    email: string;
    hashedPassword: string;
  }): Promise<any>;

  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<any>;

  findRefreshToken(token: string): Promise<any>;

  deleteRefreshToken(id: string): Promise<any>;
  deleteAllRefreshTokensByUserId(userId: string): Promise<any>;

  getCurrentUser(userId: string): Promise<any>;
}
