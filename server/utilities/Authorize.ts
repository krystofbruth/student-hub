import { type H3Event } from "h3";
import { UtilityResult } from "./UtilityResult";
import { AccessTokenPayload } from "../../shared/types/AccessTokenPayload";
import { ErrorCodes, ErrorResponse } from "~~/shared/types/ErrorResponse";
import { verifyAccessToken } from "../services/AuthorizationService";

export async function Authorize(
  event: H3Event,
): Promise<UtilityResult<AccessTokenPayload>> {
  try {
    const authorizationHeader = event.headers.get("Authorization");
    if (!authorizationHeader)
      throw {
        message: "Authorization header missing from request.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      };

    const authorization = authorizationHeader.split(" ");
    const scheme = authorization[0];
    if (scheme !== "Bearer")
      throw {
        message: "Scheme not supported.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      };

    const accessToken = authorization[1];
    if (!accessToken)
      throw {
        message: "AccessToken missing from request.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      };

    const verification = await verifyAccessToken(accessToken);
    if (!verification.success)
      throw {
        message: "AccessToken invalid.",
        success: false,
        status: 401,
        code: ErrorCodes.AUTHORIZATION_ERROR,
      };

    return { success: true, data: verification.data };
  } catch (error) {
    const response = error as ErrorResponse;
    setResponseStatus(event, response.status);
    return { success: false, errorResponse: response };
  }
}
5;
