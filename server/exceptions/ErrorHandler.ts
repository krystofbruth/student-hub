import { ErrorCodes, ErrorResponse } from "#shared/types/ErrorResponse";
import { Exception } from "./Exception";
import { UnknownException } from "./UnknownException";

const mapExceptionToErrorResponse = (exception: Exception): ErrorResponse => {
  const status = mapErrorCodeToHTTPStatus(exception.code);

  let message: string, code: ErrorCodes;
  if (exception instanceof UnknownException) {
    message = "Internal server error occured, please contact the maintainers.";
    code = ErrorCodes.INTERNAL_SERVER_ERROR;
  } else {
    message = exception.message;
    code = exception.code;
  }

  return { status, success: false, code, message };
};

const mapErrorCodeToHTTPStatus = (code: ErrorCodes): number => {
  // TODO
};

defineNitroErrorHandler((error, event) => {
  let exception: Exception;

  if (error instanceof Exception) exception = error;
  else exception = new UnknownException(error);

  if (exception instanceof UnknownException) console.error(exception);

  const response = mapExceptionToErrorResponse(exception);
  setResponseHeader(event, "Content-Type", "application/json");
  return send(event, JSON.stringify(response));
});
