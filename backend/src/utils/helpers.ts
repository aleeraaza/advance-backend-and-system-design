import bcrypt from "bcrypt";
import { hash } from "node:crypto";

export const comparePassword = async ({
  hashedPassword,
  userPassword,
}: {
  hashedPassword: string;
  userPassword: string;
}) => {
  const isMatch = await bcrypt.compare(userPassword, hashedPassword);

  return isMatch;
};
