import { Exception } from "./Exception";

export class ImplementationException extends Exception {
  constructor(message: string) {
    super(
      ErrorCodes.NOT_IMPLEMENTED,
      message || "This method is currently not implemented."
    );
  }
}
