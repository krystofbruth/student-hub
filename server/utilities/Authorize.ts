import { type H3Event } from "h3";
import { UtilityResult } from "./UtilityResult";
import { AccessTokenPayload } from "../models/AccessTokenPayload";
import { ErrorCodes } from "~~/shared/types/ErrorResponse";
import { verifyAccessToken } from "../services/AuthorizationService";

export async function Authorize(
  event: H3Event
): Promise<UtilityResult<AccessTokenPayload>> {
  const authorizationHeader = event.headers.get("Authorization");
  if (!authorizationHeader)
    return {
      success: false,
      errorResponse: {
        message: "Authorization header missing from request.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      },
    };

  const authorization = authorizationHeader.split(" ");
  const scheme = authorization[0];
  if (scheme !== "Bearer")
    return {
      success: false,
      errorResponse: {
        message: "Scheme not supported.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      },
    };

  const accessToken = authorization[1];
  if (!accessToken)
    return {
      success: false,
      errorResponse: {
        message: "AccessToken missing from request.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      },
    };

  const verification = await verifyAccessToken(accessToken);
  if (!verification.success)
    return {
      success: false,
      errorResponse: {
        message: "AccessToken invalid.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      },
    };

  return { success: true, data: verification.data };
}
5;
