export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  /** ISO Date */
  accessTokenExpiration: string;
  success: true;
  status: 200;
}
