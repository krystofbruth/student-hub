import { Exception } from "./Exception";

export class AuthenticationException extends Exception {
  constructor() {
    super(ErrorCodes.AUTHENTICATION_ERROR, "Authentication unsucessful.");
  }
}
