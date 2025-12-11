import { Exception } from "./Exception";

export class AuthorizationException extends Exception {
  constructor(public readonly cause?: unknown) {
    super(ErrorCodes.AUTHORIZATION_ERROR, "Authorization failed.");
  }
}
