import { InternalServerError } from "../openapi/InternalServerError.response";
import { ValidationError } from "../openapi/ValidationError.response";
import { CreateUserResponse } from "#shared/types/CreateUserResponse";
import {
  CreateUserRequestSchema,
  CreateUserRequest,
} from "#shared/types/CreateUserRequest";
import z from "zod";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import UserService from "../services/UserService";
import { ValidateRequestBody } from "../utilities/Validate";

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
    const validation = await ValidateRequestBody<CreateUserRequest>(
      event,
      CreateUserRequestSchema
    );
    if (!validation.success) return validation.errorResponse;

    const body: CreateUserRequest = validation.data;

    const result = await UserService.registerUser(
      body.email,
      body.displayName,
      body.email,
      body.password
    );
    if (!result.success) throw result.error;

    const response: CreateUserResponse = { success: true, status: 201 };

    return response;
  }
);
