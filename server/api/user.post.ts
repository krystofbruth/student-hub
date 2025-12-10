import { InternalServerError } from "../openapi/InternalServerError.response";
import { ValidationError } from "../openapi/ValidationError.response";
import { CreateUserResponse } from "#shared/types/CreateUserResponse";
import { CreateUserRequest } from "#shared/types/CreateUserRequest";
import z from "zod";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import UserService from "../services/UserService";
import { ValidateRequestBody } from "../utilities/Validate";

const CreateUserSchema = z.object({
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
    const validation = await ValidateRequestBody<
      z.infer<typeof CreateUserSchema>
    >(event, CreateUserSchema);
    if (!validation.success) return validation.errorResponse;

    const body: CreateUserRequest = validation.data;

    const result = await UserService.registerUser(body);
    if (!result.success) throw result.error;

    const response: CreateUserResponse = { success: true, status: 201 };

    return response;
  }
);
