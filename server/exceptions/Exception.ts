export abstract class Exception {
  constructor(
    public readonly code: ErrorCodes,
    public readonly message: string
  ) {}
}
