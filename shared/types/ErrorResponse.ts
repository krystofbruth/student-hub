export enum ErrorCodes {
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
}

export interface ErrorResponse {
  code: ErrorCodes;
  message: string;
}
