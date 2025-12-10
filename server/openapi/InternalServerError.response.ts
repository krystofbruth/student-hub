import { ErrorCodes, ErrorResponse } from "~~/shared/types/ErrorResponse";
import { constructOpenAPIJSONResponse } from "./ResponseConstruct";
import { mapErrorCodeToHTTPStatus } from "../utilities/ErrorHandler";

const internalServerErrorBody: ErrorResponse = {
  code: ErrorCodes.INTERNAL_SERVER_ERROR,
  message: "Internal server error occured, please contact the maintainers.",
  success: false,
  status: mapErrorCodeToHTTPStatus(ErrorCodes.INTERNAL_SERVER_ERROR),
};

export const InternalServerError = constructOpenAPIJSONResponse(
  "Internal server error occured, contact the maintainers.",
  internalServerErrorBody
);
