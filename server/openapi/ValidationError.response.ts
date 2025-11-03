import { ErrorCodes, ErrorResponse } from "#shared/types/ErrorResponse";
import { constructOpenAPIJSONResponse } from "./ResponseConstruct";

const validationErrorBody: ErrorResponse = {
  code: ErrorCodes.VALIDATION_ERROR,
  message: "Error at <field>.",
};

export const ValidationError = constructOpenAPIJSONResponse(
  "Validation error occured, consult the `message` prope for further details.",
  validationErrorBody
);
