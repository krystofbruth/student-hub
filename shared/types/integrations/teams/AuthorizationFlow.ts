import z from "zod";

// TODO - DONT IMPORT FROM HERE! WHAT IF YOU WANT TO CHANGE ANYTHING? YOU HAVE TO REBUILD BECAUSE ENVs ARE NOT AVAILABLE CLIENT SIDE!

// Exposed values
export const scopes = [
  "EduAssignments.ReadBasic",
  "offline_access",
  "User.Read",
];

// Prod
export const redirectUri =
  "https://studenthub.bruthans.eu/register-integration/teams";
// Dev
// export const redirectUri = "http://localhost:3000/register-integration/teams";

export const client_id = "e6886ff2-5a69-4858-8d0f-eb5f040ea436";

export const tenant = "organizations";

export const formattedScopes = scopes.join(" ");

// Local values
const response_type = "code";

const response_mode = "query";

export const loginUri = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirectUri}&response_mode=${response_mode}&scope=${formattedScopes}`;

export const CreateTeamsSourceCredentialsSchema = z.object({
  authorizationToken: z.string(),
});

export type CreateTeamsSourceCredentials = z.infer<
  typeof CreateTeamsSourceCredentialsSchema
>;
