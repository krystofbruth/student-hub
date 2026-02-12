import type { Exception } from "./Exceptions";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: Exception;
    };
