// TODO: Separate password hashing and checking into its own service!
// Implement entire flow
import { LoginRequest } from "~~/shared/types/LoginRequest";
import { Result } from "../helpers/Result";
import { ImplementationException } from "../exceptions/ImplementationException";

export type LoginResult =
  | {
      result: "success";
      accessToken: string;
      refreshToken: string;
    }
  | {
      // Will be used in MFA
      result: "challenge";
    };

export const login = async (
  loginRequest: LoginRequest
): Promise<Result<LoginResult>> => {
  return { success: false, error: new ImplementationException() };
};
