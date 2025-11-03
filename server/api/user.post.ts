import { InternalServerError } from "../openapi/InternalServerError.response";
import { ValidationError } from "../openapi/ValidationError.response";

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

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log(body);

  return { success: "true" };
});
