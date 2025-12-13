import z from "zod";
import { ValidateQueryParameters } from "../utilities/Validate";
import { fetchEvents } from "../services/EventService";
import { Authorize } from "../utilities/Authorize";
import {
  FetchEventsResponse,
  EventView,
} from "~~/shared/types/FetchEventsResponse";
import { IEvent } from "../models/Event";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";

const parametersSchema = z.object({
  limit: z.number().max(100).min(1).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

// defineRouteMeta({
//   openAPI: {
//     tags: ["Event"],
//     responses: {
//       "200": constructOpenAPIJSONResponse(
//         "Fetch success, the body contains an array of type `Event`.",
//         { type: "array", items: EventViewOpenAPISchema }
//       ),
//       "401": AuthorizationError,
//       "500": InternalServerError,
//     },
//   },
// });

const mapEventToResponse = (event: IEvent): EventView => {
  return {
    _id: event._id.toString(),
    sourceId: event.sourceId.toString(),
    type: event.type,
    dueAt: event.dueAt.toISOString(),
    uri: event.uri,
  };
};

defineEventHandler(
  async (event): Promise<FetchEventsResponse | ErrorResponse> => {
    const authorization = await Authorize(event);
    if (!authorization.success) return authorization.errorResponse;

    const queryParametersValidation = await ValidateQueryParameters<
      z.infer<typeof parametersSchema>
    >(event, parametersSchema);
    if (!queryParametersValidation.success)
      return queryParametersValidation.errorResponse;

    const result = await fetchEvents({
      userId: authorization.data.userId,
      limit: queryParametersValidation.data.limit,
      offset: queryParametersValidation.data.offset,
    });
    if (!result.success) throw result.error;

    const response: FetchEventsResponse = {
      success: true,
      events: result.data.map((e) => mapEventToResponse(e)),
    };

    return response;
  }
);
