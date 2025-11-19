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
