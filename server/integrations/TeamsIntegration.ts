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
} from "#shared/types/integrations/teams/AuthorizationFlow";

// Per documentation: https://learn.microsoft.com/en-us/graph/auth-v2-user?tabs=http

const client_secret = process.env.TEAMS_CLIENT_SECRET;

export class TeamsIntegration implements Integration {
  public readonly serviceName: RegisteredServiceNames =
    RegisteredServiceNames.TEAMS;

  fetchEvents(
    credentials: object,
    sourceId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<Result<EventWithoutId[]>> {
    throw new Error("Method not implemented.");
  }

  createSource(event: RequestDetails): Promise<Result<any>> {
    throw new Error("Method not implemented.");
  }

  unlinkSource(sourceId: Types.ObjectId): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
