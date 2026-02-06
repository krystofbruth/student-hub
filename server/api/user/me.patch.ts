import { Authorize } from "~~/server/utilities/Authorize";
import { UpdateUserSelfResponse } from "#shared/types/UpdateUserSelfResponse";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import { updateUser } from "~~/server/services/UserService";
import { CastStringToObjectId } from "~~/server/utilities/Cast";
import { ValidateRequestBody } from "~~/server/utilities/Validate";
import {
  UpdateUserSelfRequest,
  UpdateUserSelfRequestSchema,
} from "#shared/types/UpdateUserSelfRequest";
import { mapUserToUserResponse } from "./me.get";

export default defineEventHandler(
  async (event): Promise<UpdateUserSelfResponse | ErrorResponse> => {
    const authAttempt = await Authorize(event);
    if (!authAttempt.success) return authAttempt.errorResponse;

    const userId = CastStringToObjectId(authAttempt.data.userId);
    if (!userId.success)
      throw new Error(
        `Unpacked authorization token contained invalid userId ${authAttempt.data.userId}`,
      );

    const validation = await ValidateRequestBody<UpdateUserSelfRequest>(
      event,
      UpdateUserSelfRequestSchema,
    );
    if (!validation.success) return validation.errorResponse;

    const body = validation.data;

    const res = await updateUser(userId.data, body);
    if (!res.success) throw res.error;

    return { success: true, user: mapUserToUserResponse(res.data) };
  },
);
