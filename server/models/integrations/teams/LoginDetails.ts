export interface TeamsLoginDetails {
  token_type: "Bearer";
  // A space separated list of the Microsoft Graph permissions that the access token is valid for.
  scope: string;
  // How long the access token is valid (in seconds).
  expires_in: number;
  // Indicates an extended lifetime for the access token (in seconds) and used to support resiliency when the token issuance service isn't responding.
  ext_expires_in: number;
  // The requested access token. The app can use this token to call Microsoft Graph.
  access_token: string;
  // An OAuth 2.0 refresh token. The app can use this token to acquire additional access tokens after the current access token expires. Refresh tokens are long-lived, and can be used to retain access to resources for extended periods of time. A refresh token is only returned if you include offline_access as a scope parameter.
  refresh_token: string;

  lastRefresh: Date;
}
