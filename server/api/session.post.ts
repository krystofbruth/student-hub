import z from "zod";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import { LoginResponse } from "~~/shared/types/LoginResponse";
import { ValidateRequestBody } from "../utilities/Validate";
import { login } from "../services/AuthenticationService";
import { ImplementationException } from "../exceptions/ImplementationException";
import { LoginRequestSchema, LoginRequest } from "~~/shared/types/LoginRequest";

export default defineEventHandler(
  async (event): Promise<LoginResponse | ErrorResponse> => {
    const validation = await ValidateRequestBody<
      z.infer<typeof LoginRequestSchema>
    >(event, LoginRequestSchema);
    if (!validation.success) return validation.errorResponse;

    const loginRequest: LoginRequest = validation.data;

    const result = await login(loginRequest);
    if (!result.success) throw result.error;

    const loginResult = result.data;
    if (loginResult.result === "challenge")
      throw new ImplementationException(
        "Challenge currently not implemented in the controller."
      );

    return {
      success: true,
      status: 201,
      tokens: {
        refreshToken: loginResult.session.refreshToken,
        accessToken: loginResult.accessToken,
      },
    };
  }
);
