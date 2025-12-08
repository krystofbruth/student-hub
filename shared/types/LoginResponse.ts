export interface LoginResponse {
  success: true;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
