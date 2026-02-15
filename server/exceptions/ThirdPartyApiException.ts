import { Exception } from "./Exception";

export class ThirdPartyApiException extends Exception {
  constructor(
    public readonly integration: RegisteredIntegrationNames,
    public readonly originId: string,
    public readonly details: any,
  ) {
    super(
      ErrorCodes.THIRD_PARTY_API,
      "An exception occured during communication with a third party API.",
    );
  }
}
