import { Exception } from "./Exception";

export class NotFoundException implements Exception {
  public readonly code;
  public readonly message;

  constructor(public readonly target: string) {
    this.code = ErrorCodes.NOT_FOUND;
    this.message = `Entity ${target} not found.`;
  }
}
