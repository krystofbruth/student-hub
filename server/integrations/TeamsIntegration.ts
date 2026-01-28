import type { Types } from "mongoose";
import type { Result } from "../helpers/Result";
import {
  type EventWithoutId,
  type Integration,
  RegisteredServiceNames,
  type RequestDetails,
} from "./Integration";
import {
  scopes,
  redirectUri,
  tenant,
  client_id,
  CreateTeamsSourceSchema,
  formattedScopes,
  grant_type,
} from "#shared/types/integrations/teams/AuthorizationFlow";
import z, { success } from "zod";
import { ValidationException } from "../exceptions/ValidationException";
import { ImplementationException } from "../exceptions/ImplementationException";

// Per documentation: https://learn.microsoft.com/en-us/graph/auth-v2-user?tabs=http

const client_secret = process.env.TEAMS_CLIENT_SECRET;

export class TeamsIntegration implements Integration {
  public readonly serviceName: RegisteredServiceNames =
    RegisteredServiceNames.TEAMS;

  fetchEvents(
    credentials: object,
    sourceId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Result<EventWithoutId[]>> {
    throw new Error("Method not implemented.");
  }

  async createSource(event: RequestDetails): Promise<Result<any>> {
    const validation = z.safeParse(CreateTeamsSourceSchema, event.body);
    if (!validation.success)
      return {
        success: false,
        error: new ValidationException(
          z.flattenError(validation.error).fieldErrors,
        ),
      };

    const client_secret = process.env.TEAMS_CLIENT_SECRET;
    if (!client_secret)
      return {
        success: false,
        error: new ImplementationException(
          "Not implemented correctly: missing credentials for successful integration.",
        ),
      };

    try {
      const res = await fetch(
        `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: client_id,
            grant_type: grant_type,
            scope: formattedScopes,
            code: validation.data.authorizationToken,
            redirect_uri: redirectUri,
            client_secret: client_secret,
          }),
        },
      );

      if (!res.ok) throw res;
    } catch (error) {}
  }

  unlinkSource(sourceId: Types.ObjectId): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
