import { Exception } from "./Exception";

// Will differ from RateLimitException! Targeted at max number of connections for e.g.
export class LimitReachedException extends Exception {
  constructor(public readonly limit: number) {
    super(
      ErrorCodes.LIMIT_REACHED,
      "Maximum limit of operations or resources reached.",
    );
  }
}
