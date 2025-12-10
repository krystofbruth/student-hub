import { Exception } from "./Exception";

export class ImplementationException implements Exception {
  constructor(
    public readonly message = "This method is currently not implemented.",
    public readonly code = ErrorCodes.NOT_IMPLEMENTED
  ) {}
}
