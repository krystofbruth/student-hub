/** Detailed user response. Also see UserBasicResponse.ts */
export interface UserResponse {
  _id: string;
  email: string;
  displayName: string;
  username: string;
  /** ISO Date */
  lastSync: string;
}

export interface FetchUserSelfResponse {
  success: boolean;
  status: 200;
  user: UserResponse;
}
