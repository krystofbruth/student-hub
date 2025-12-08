import { Exception } from "./Exception";

export class ImplementationException implements Exception {
  public readonly code = ErrorCodes.NOT_IMPLEMENTED;
  public readonly message = "This method is currently not implemented.";
}
