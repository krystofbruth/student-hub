import { Exception } from "./Exception";

export class UnknownException implements Exception {
  public readonly code = ErrorCodes.INTERNAL_SERVER_ERROR;
  public readonly message: string = "Unrecognized error occured.";

  constructor(public readonly error: unknown) {}
}
