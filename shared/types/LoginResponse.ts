export interface LoginResponse {
  success: true;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  status: 201;
}
