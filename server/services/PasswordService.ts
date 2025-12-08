import bcrypt from "bcrypt";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";

const SALT_ROUNDS = 10;

export const generatePasswordHash = async (
  plainText: string
): Promise<Result<string>> => {
  try {
    const hash = await bcrypt.hash(plainText, SALT_ROUNDS);
    return { success: true, data: hash };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const checkPassword = async (
  input: string,
  passwordHash: string
): Promise<Result<boolean>> => {
  try {
    const result = await bcrypt.compare(input, passwordHash);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
