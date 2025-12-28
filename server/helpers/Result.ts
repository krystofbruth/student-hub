import { Exception } from "../exceptions/Exception";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: Exception;
    };

export type ExtendedResult<T> =
  | Result<T>
  | { success: "PARTIAL"; data: T; errors: unknown };
