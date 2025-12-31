export interface LoginResponse {
  success: true;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  /** ISO Date */
  accessTokenExpiration: string;
  status: 201;
}
