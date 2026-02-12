export class Exception extends Error {
  public readonly date: Date;

  constructor() {
    super();
    this.date = new Date();
  }
}

export enum AuthReason {
  AUTH_INVALID = "AUTH_INVALID",
  AUTH_MISSING = "AUTH_MISSING",
  AUTH_INTERCEPTED = "AUTH_INTERCEPTED",
}

export class ApiException extends Exception {
  constructor(
    public readonly reason: "error_response" | "authorization" | "unknown",
    public readonly path: string,
    public readonly details: {
      authReason?: AuthReason;
      response?: ErrorResponse;
    },
  ) {
    super();
  }
}
