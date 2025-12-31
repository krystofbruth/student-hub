import { LoginRequest } from "~~/shared/types/LoginRequest";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { User } from "../models/User";
import { AuthenticationException } from "../exceptions/AuthenticationException";
import { checkPassword } from "./PasswordService";
import { createSession } from "./AuthorizationService";
import { ISession } from "../models/Session";

export type LoginResult =
  | {
      result: "success";
      accessToken: string;
      session: ISession;
      accessTokenExpiration: Date;
    }
  | {
      // Will be used in MFA
      result: "challenge";
    };

export const login = async (
  loginRequest: LoginRequest
): Promise<Result<LoginResult>> => {
  try {
    const user = await User.findOne({ email: loginRequest.email });
    if (!user) return { success: false, error: new AuthenticationException() };

    const passwordCheck = await checkPassword(
      loginRequest.password,
      user.passwordHash
    );
    if (!passwordCheck.success) return passwordCheck;
    if (!passwordCheck.data)
      return { success: false, error: new AuthenticationException() };

    const tokenGenerationAttempt = await createSession(user);
    if (!tokenGenerationAttempt.success) return tokenGenerationAttempt;

    return {
      success: true,
      data: {
        result: "success",
        accessToken: tokenGenerationAttempt.data.accessToken,
        session: tokenGenerationAttempt.data.session,
        accessTokenExpiration:
          tokenGenerationAttempt.data.accessTokenExpiration,
      },
    };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
