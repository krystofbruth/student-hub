import mongoose from "mongoose";
import { type RequestDetails } from "~~/server/models/Integration";
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import { createSource } from "~~/server/services/SourceService";
import { Authorize } from "~~/server/utilities/Authorize";
import {
  ErrorCodes,
  type ErrorResponse,
  type ValidationErrorResponse,
} from "~~/shared/types/ErrorResponse";

export default defineEventHandler(async (event) => {
  const authorization = await Authorize(event);
  if (!authorization.success) return authorization.errorResponse;

  const serviceNameParam = getRouterParam(event, "service_name");
  if (
    !serviceNameParam ||
    !Object.values(RegisteredIntegrationNames).includes(
      serviceNameParam as RegisteredIntegrationNames,
    )
  ) {
    const response: ErrorResponse = {
      status: 409,
      success: false,
      code: ErrorCodes.NOT_IMPLEMENTED,
      message: "The specified service name not implemented.",
    };
    return response;
  }

  // Woof
  const serviceName: RegisteredIntegrationNames =
    serviceNameParam as RegisteredIntegrationNames;

  const headers: { [header: string]: string } = {};
  for (const key in event.headers.keys()) {
    if (!event.headers.get(key)) continue;
    // :C
    headers[key] = event.headers.get(key) as string;
  }

  let requestDetails: RequestDetails;
  try {
    requestDetails = {
      body: await readBody(event),
      headers,
      query: getQuery(event),
      path: event.path,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    const response: ValidationErrorResponse = {
      success: false,
      status: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      issues: {},
      message: "Query or body not valid.",
    };
    return response;
  }

  const userId = new mongoose.Types.ObjectId(authorization.data.userId);
  const sourceCreation = await createSource(
    serviceName,
    userId,
    requestDetails,
  );

  if (!sourceCreation.success) throw sourceCreation.error;

  // TODO - Prepare request & response interfaces and return response

  return { success: true };
});
