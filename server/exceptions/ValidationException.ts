import { Exception } from "./Exception";

export class ValidationException extends Exception {
  constructor(public readonly errors: { [key: string]: string[] | undefined }) {
    super(
      ErrorCodes.VALIDATION_ERROR,
      "Validation error occured, consult `issues` property."
    );
  }
}
