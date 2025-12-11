import { Exception } from "./Exception";

export class NotFoundException extends Exception {
  constructor(public readonly target: string) {
    super(ErrorCodes.NOT_FOUND, `Entity ${target} not found.`);
  }
}
