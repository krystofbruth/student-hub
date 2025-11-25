import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const generatePasswordHash = async (
  plainText: string
): Promise<string> => {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
};

export const checkPassword = async (
  input: string,
  passwordHash: string
): Promise<boolean> => {
  return await bcrypt.compare(input, passwordHash);
};
