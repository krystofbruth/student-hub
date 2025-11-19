import { InternalServerError } from "../openapi/InternalServerError.response";
import { ValidationError } from "../openapi/ValidationError.response";
import { CreateUserResponse } from "#shared/types/CreateUserResponse";
import { CreateUserRequest } from "#shared/types/CreateUserRequest";
import z from "zod";
import { ErrorCodes, ErrorResponse } from "~~/shared/types/ErrorResponse";
import UserService from "../services/UserService";

const CreateUserValidator = z.object({
  email: z.email(),
  password: z.string(),
  displayName: z.string(),
});

defineRouteMeta({
  openAPI: {
    tags: ["User"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "displayName"],
            properties: {
              email: {
                type: "string",
              },
              displayName: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description:
          "User pre-registration success, e-mail verification must now take place.",
      },
      "400": ValidationError,
      "500": InternalServerError,
    },
  },
});

export default defineEventHandler(
  async (event): Promise<CreateUserResponse | ErrorResponse> => {
    const validation = CreateUserValidator.safeParse(readBody(event));

    if (!validation.success)
      return {
        success: false,
        code: ErrorCodes.VALIDATION_ERROR,
        message: validation.error.message,
        status: 400,
      };

    const body: CreateUserRequest = validation.data;

    const result = await UserService.registerUser(body);
    if (!result.success) throw result.error;

    const response: CreateUserResponse = { success: true };

    return response;
  }
);
