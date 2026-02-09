import { InternalServerError } from "../../openapi/InternalServerError.response";
import { ValidationError } from "../../openapi/ValidationError.response";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import { ValidateRequestBody } from "~~/server/utilities/Validate";
import { verifyUser } from "~~/server/services/UserService";
import z from "zod";

defineRouteMeta({
  openAPI: {
    tags: ["User"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId"],
            properties: {
              userId: {
                type: "string",
                description: "Identifier of the user to verify.",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "User has been successfully verified.",
      },
      "400": ValidationError,
      "500": InternalServerError,
    },
  },
});

const VerifyUserRequestSchema = z.object({
  userId: z.string(),
});

type VerifyUserRequest = z.infer<typeof VerifyUserRequestSchema>;

type VerifyUserResponse = { success: true; status: 200 };

export default defineEventHandler(
  async (event): Promise<VerifyUserResponse | ErrorResponse> => {
    const validation = await ValidateRequestBody<VerifyUserRequest>(
      event,
      VerifyUserRequestSchema,
    );
    if (!validation.success) return validation.errorResponse;

    const body = validation.data;

    const result = await verifyUser(body.userId);
    if (!result.success) throw result.error;

    return { success: true, status: 200 };
  },
);

