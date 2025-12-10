import { ErrorResponse } from "~~/shared/types/ErrorResponse";

export type UtilityResult<T> =
  | { success: true; data: T }
  | { success: false; errorResponse: ErrorResponse };
