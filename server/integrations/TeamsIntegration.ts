import type { Types } from "mongoose";
import type { Result } from "../helpers/Result";
import { type EventWithoutId, type Integration } from "../models/Integration";
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import {
  scopes,
  redirectUri,
  tenant,
  client_id,
  CreateTeamsSourceCredentialsSchema,
  formattedScopes,
} from "#shared/types/integrations/teams/AuthorizationFlow";
import z, { success } from "zod";
import { ValidationException } from "../exceptions/ValidationException";
import { ImplementationException } from "../exceptions/ImplementationException";
import { UnknownException } from "../exceptions/UnknownException";
import { TeamsAuthorizationSuccessResponse } from "../models/integrations/teams/External-AuthorizationResponse";
import { ISource, Source } from "../models/Source";
import { TeamsLoginDetails } from "../models/integrations/teams/LoginDetails";
import { EducationAssignment } from "../models/integrations/teams/External-educationAssignment";
import { EventType } from "#imports";

let integrationActive = true;

// Per documentation: https://learn.microsoft.com/en-us/graph/auth-v2-user?tabs=http
const client_secret = process.env.TEAMS_CLIENT_SECRET || "";
if (!process.env.TEAMS_CLIENT_SECRET) {
  console.error("Teams client secret undefined, Teams integration disabled");
  integrationActive = false;
}

export class TeamsIntegration implements Integration {
  public readonly serviceName: RegisteredIntegrationNames =
    RegisteredIntegrationNames.TEAMS;

  public async fetchEvents(
    credentials: object,
    sourceId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Result<EventWithoutId[]>> {
    let teamsCredentials = credentials as TeamsLoginDetails;

    if (
      Date.now() -
        (teamsCredentials.lastRefresh.getTime() +
          teamsCredentials.expires_in * 1000) >=
      0
    ) {
      const refreshAttempt = await this.refreshToken(
        teamsCredentials,
        sourceId,
      );
      if (!refreshAttempt.success) return refreshAttempt;
      teamsCredentials = refreshAttempt.data;
    }

    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/education/me/assignments?$filter=dueDateTime gt ${new Date().toISOString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `${teamsCredentials.token_type} ${teamsCredentials.access_token}`,
          },
        },
      );

      if (!res.ok) throw res;

      const assignments: EducationAssignment[] = (await res.json()).value;

      return {
        success: true,
        data: assignments.map((a) =>
          this.mapEducationAssignmentToEvent(a, sourceId, userId),
        ),
      };
    } catch (error) {
      return { success: false, error: new UnknownException(error) };
    }
  }

  private async refreshToken(
    credentials: TeamsLoginDetails,
    sourceId: Types.ObjectId,
  ): Promise<Result<TeamsLoginDetails>> {
    try {
      const res = await fetch(
        `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: client_id,
            grant_type: "refresh_token",
            scope: formattedScopes,
            refresh_token: credentials.refresh_token,
            client_secret: client_secret,
          }),
        },
      );

      if (!res.ok) throw res;

      const lastRefresh = new Date();
      const response = (await res.json()) as TeamsAuthorizationSuccessResponse;
      const loginDetails = { lastRefresh, ...response };
      await Source.updateOne(
        { _id: sourceId },
        { $set: { credentials: loginDetails } },
      );

      return { success: true, data: loginDetails };
    } catch (error) {
      return { success: false, error: new UnknownException(error) };
    }
  }

  private mapEducationAssignmentToEvent(
    eduAssignment: EducationAssignment,
    sourceId: Types.ObjectId,
    userId: Types.ObjectId,
  ): EventWithoutId {
    let description: string = "";

    if (eduAssignment.instructions)
      description = eduAssignment.instructions.content;

    return {
      sourceId,
      type: EventType.ASSIGNMENT,
      dueAt: new Date(eduAssignment.dueDateTime),
      uri: eduAssignment.webUrl,
      targetId: eduAssignment.id,
      userId,
      title: { en: eduAssignment.displayName, cs: eduAssignment.displayName },
      description: { en: description, cs: description },
    };
  }

  async createSource(credentials: unknown): Promise<Result<TeamsLoginDetails>> {
    const validation = z.safeParse(
      CreateTeamsSourceCredentialsSchema,
      credentials,
    );
    if (!validation.success)
      return {
        success: false,
        error: new ValidationException(
          z.flattenError(validation.error).fieldErrors,
        ),
      };

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
            grant_type: "authorization_code",
            scope: formattedScopes,
            code: validation.data.authorizationToken,
            redirect_uri: redirectUri,
            client_secret: client_secret,
          }),
        },
      );

      if (!res.ok) {
        if (res.status === 400)
          return {
            success: false,
            error: new ValidationException({
              authorizationToken: [
                "Invalid token, rejected by the Microsoft authorization API.",
              ],
            }),
          };
        else throw { response: res, body: await res.json() };
      }

      const response = (await res.json()) as TeamsAuthorizationSuccessResponse;
      const lastRefresh = new Date();

      return {
        success: true,
        data: {
          lastRefresh,
          ...response,
        },
      };
    } catch (error) {
      //@ts-expect-error
      console.log(await error.json());
      return {
        success: false,
        error: new UnknownException(error),
      };
    }
  }

  public async unlinkSource(source: ISource): Promise<undefined> {
    // Only forgetting Teams credentials is enough for now.
    return undefined;
  }
}

let teamsIntegration: TeamsIntegration | undefined;
export const useTeamsIntegration = async () => {
  if (!integrationActive) throw new Error("Teams integration disabled.");

  if (!teamsIntegration) teamsIntegration = new TeamsIntegration();

  return teamsIntegration;
};
