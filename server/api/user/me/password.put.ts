import { Authorize } from "~~/server/utilities/Authorize";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import { CastStringToObjectId } from "~~/server/utilities/Cast";
import { ValidateRequestBody } from "~~/server/utilities/Validate";
import {
  UpdateUserPasswordRequest,
  UpdateUserPasswordRequestSchema,
} from "#shared/types/UpdateUserPasswordRequest";
import { updateUserPassword } from "~~/server/services/UserService";
import { UpdateUserPasswordResponse } from "#shared/types/UpdateUserPasswordResponse";

defineRouteMeta({
  openAPI: {
    tags: ["User"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["oldPassword", "newPassword"],
            properties: {
              oldPassword: {
                type: "string",
              },
              newPassword: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "User password has been updated successfully.",
      },
      "400": {
        description: "Validation error occured, consult the `issues` property.",
      },
      "401": {
        description: "Current password does not match.",
      },
      "500": {
        description:
          "Internal server error occured, please contact the maintainers.",
      },
    },
  },
});

export default defineEventHandler(
  async (event): Promise<UpdateUserPasswordResponse | ErrorResponse> => {
    const authAttempt = await Authorize(event);
    if (!authAttempt.success) return authAttempt.errorResponse;

    const userId = CastStringToObjectId(event, authAttempt.data.userId);
    if (!userId.success) return userId.errorResponse;

    const validation = await ValidateRequestBody<UpdateUserPasswordRequest>(
      event,
      UpdateUserPasswordRequestSchema,
    );
    if (!validation.success) return validation.errorResponse;

    const body = validation.data;

    const res = await updateUserPassword(
      userId.data,
      body.oldPassword,
      body.newPassword,
    );
    if (!res.success) throw res.error;

    return { success: true, status: 200 };
  },
);
