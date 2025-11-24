import { ErrorCodes, ErrorResponse } from "~~/shared/types/ErrorResponse";
import { constructOpenAPIJSONResponse } from "./ResponseConstruct";
import { mapErrorCodeToHTTPStatus } from "../exceptions/ErrorHandler";

const authorizationErrorBody: ErrorResponse = {
  code: ErrorCodes.AUTHORIZATION_ERROR,
  message: "Authorization wasn't present or was invalid.",
  success: false,
  status: mapErrorCodeToHTTPStatus(ErrorCodes.AUTHORIZATION_ERROR),
};

export const AuthorizationError = constructOpenAPIJSONResponse(
  "Authorization wasn't present or was invalid.",
  authorizationErrorBody
);
