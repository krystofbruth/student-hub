const scopes = ["EduAssignments.ReadBasic", "offline_access", "User.Read"];

export const TeamsScopes = scopes.join("%20");

// Dev, overrid in prod
export const redirectUri = "http://localhost:3000";
