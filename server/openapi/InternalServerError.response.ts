import { ErrorCodes, ErrorResponse } from "~~/shared/types/ErrorResponse";
import { constructOpenAPIJSONResponse } from "./ResponseConstruct";

const internalServerErrorBody: ErrorResponse = {
  code: ErrorCodes.INTERNAL_SERVER_ERROR,
  message: "Internal server error occured, please contact the maintainers.",
};

export const InternalServerError = constructOpenAPIJSONResponse(
  "Internal server error occured, contact the maintainers.",
  internalServerErrorBody
);
