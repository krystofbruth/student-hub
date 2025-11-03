import { constructOpenAPIJSONResponse } from "../openapi/ResponseConstruct";
import { EventViewOpenAPISchema } from "#shared/types/EventView";
import { AuthorizationError } from "../openapi/AuthorizationError.response";
import { InternalServerError } from "../openapi/InternalServerError.response";

defineRouteMeta({
  openAPI: {
    tags: ["Event"],
    responses: {
      "200": constructOpenAPIJSONResponse(
        "Fetch success, the body contains an array of type `Event`.",
        { type: "array", items: EventViewOpenAPISchema }
      ),
      "401": AuthorizationError,
      "500": InternalServerError,
    },
  },
});
