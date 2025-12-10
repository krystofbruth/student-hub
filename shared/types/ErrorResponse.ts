export enum ErrorCodes {
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  CONFLICT = "CONFLICT",
  NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
}

export interface ErrorResponse {
  success: false;
  status: number;
  code: ErrorCodes;
  message: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  issues: { [key: string]: string[] | undefined };
}
