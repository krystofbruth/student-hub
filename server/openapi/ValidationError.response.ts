import { ErrorCodes, ErrorResponse } from "#shared/types/ErrorResponse";
import { constructOpenAPIJSONResponse } from "./ResponseConstruct";
import { mapErrorCodeToHTTPStatus } from "../exceptions/ErrorHandler";

const validationErrorBody: ErrorResponse = {
  code: ErrorCodes.VALIDATION_ERROR,
  message: "Error at <field>.",
  success: false,
  status: mapErrorCodeToHTTPStatus(ErrorCodes.VALIDATION_ERROR),
};

export const ValidationError = constructOpenAPIJSONResponse(
  "Validation error occured, consult the `message` prope for further details.",
  validationErrorBody
);
