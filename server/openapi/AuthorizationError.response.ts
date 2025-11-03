import { ErrorCodes, ErrorResponse } from "~~/shared/types/ErrorResponse";
import { constructOpenAPIJSONResponse } from "./ResponseConstruct";

const authorizationErrorBody: ErrorResponse = {
  code: ErrorCodes.AUTHORIZATION_ERROR,
  message: "Authorization wasn't present or was invalid.",
};

export const AuthorizationError = constructOpenAPIJSONResponse(
  "Authorization wasn't present or was invalid.",
  authorizationErrorBody
);
