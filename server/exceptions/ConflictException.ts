import { Exception } from "./Exception";

export class ConflictException implements Exception {
  public readonly code = ErrorCodes.CONFLICT;
  public readonly message = "Entity conflict occured.";
}
