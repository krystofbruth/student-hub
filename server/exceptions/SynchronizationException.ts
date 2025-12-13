import { Exception } from "./Exception";

export class SynchronizationException extends Exception {
  constructor(public readonly exceptions: Exception[]) {
    super(
      ErrorCodes.SYNCHRONIZATION_ERROR,
      "Exception(s) occured during synchronization."
    );
  }
}
