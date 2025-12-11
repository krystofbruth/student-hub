import { Exception } from "./Exception";

export class UnknownException extends Exception {
  constructor(public readonly error: unknown) {
    super(ErrorCodes.INTERNAL_SERVER_ERROR, "Unrecognized error occured.");
  }
}
