export interface AccessTokenPayload {
  userId: string;
  /** Number of SECONDS since Epoch. */
  exp: number;
}
