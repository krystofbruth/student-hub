import { Exception } from "./Exception";

export class ConflictException extends Exception {
  constructor() {
    super(ErrorCodes.CONFLICT, "Entity conflict occured.");
  }
}
