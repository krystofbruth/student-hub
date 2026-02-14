import mongoose from "mongoose";
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import { createSource } from "~~/server/services/SourceService";
import { Authorize } from "~~/server/utilities/Authorize";
import {
  ErrorCodes,
  type ErrorResponse,
  type ValidationErrorResponse,
} from "~~/shared/types/ErrorResponse";
import { ValidateRequestBody } from "../utilities/Validate";
import {
  CreateSourceRequest,
  CreateSourceRequestSchema,
} from "#shared/types/CreateSourceRequest";
import { CastStringToObjectId } from "../utilities/Cast";
import { UnknownException } from "../exceptions/UnknownException";

export default defineEventHandler(async (event) => {
  const authorization = await Authorize(event);
  if (!authorization.success) return authorization.errorResponse;

  const bodyValidation = await ValidateRequestBody<CreateSourceRequest>(
    event,
    CreateSourceRequestSchema,
  );
  if (!bodyValidation.success) return bodyValidation.errorResponse;
  const body = bodyValidation.data;

  const originIdCast = CastStringToObjectId(body.originId);
  if (!originIdCast.success) return originIdCast.errorResponse;
  const originId = originIdCast.data;

  const userId = new mongoose.Types.ObjectId(authorization.data.userId);
  const sourceCreation = await createSource(originId, userId, body.credentials);

  if (!sourceCreation.success) throw sourceCreation.error;

  // TODO - Prepare request & response interfaces and return response

  return { success: true };
});
