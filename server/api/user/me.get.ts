import { IUser } from "~~/server/models/User";
import { Authorize } from "../../utilities/Authorize";
import type { ErrorResponse } from "~~/shared/types/ErrorResponse";
import {
  FetchUserSelfResponse,
  UserResponse,
} from "~~/shared/types/FetchUserSelfResponse";
import { findUser } from "~~/server/services/UserService";

const mapUserToUserResponse = (user: IUser): UserResponse => {
  return {
    _id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    username: user.username,
    lastSync: user.lastSync.toISOString(),
  };
};

export default defineEventHandler(
  async (event): Promise<FetchUserSelfResponse | ErrorResponse> => {
    const authorization = await Authorize(event);
    if (!authorization.success) return authorization.errorResponse;

    const result = await findUser({ _id: authorization.data.userId });
    if (!result.success) throw result.error;

    const userResponse = mapUserToUserResponse(result.data);

    const response: FetchUserSelfResponse = {
      success: result.success,
      status: 200,
      user: userResponse,
    };

    return response;
  },
);
