import { ErrorCodes, ErrorResponse } from "#shared/types/ErrorResponse";
import { Exception } from "../exceptions/Exception";
import { UnknownException } from "../exceptions/UnknownException";

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

export const mapErrorCodeToHTTPStatus = (code: ErrorCodes): number => {
  switch (code) {
    case ErrorCodes.AUTHORIZATION_ERROR:
      return 401;
    case ErrorCodes.NOT_FOUND:
      return 404;
    case ErrorCodes.CONFLICT:
      return 409;
    case ErrorCodes.VALIDATION_ERROR:
    case ErrorCodes.AUTHENTICATION_ERROR:
      return 400;
    case ErrorCodes.INTERNAL_SERVER_ERROR:
    default:
      return 500;
  }
};

export default defineNitroErrorHandler((error, event) => {
  let exception: Exception;

  if (error.cause instanceof Exception) exception = error.cause;
  else exception = new UnknownException(error.cause);

  if (exception instanceof UnknownException) console.error(exception);

  const response = mapExceptionToErrorResponse(exception);
  setResponseHeader(event, "Content-Type", "application/json");
  return send(event, JSON.stringify(response));
});
