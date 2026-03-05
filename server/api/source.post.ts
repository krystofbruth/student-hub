import mongoose from "mongoose";
import { createSource } from "~~/server/services/SourceService";
import { Authorize } from "~~/server/utilities/Authorize";
import { type ErrorResponse } from "~~/shared/types/ErrorResponse";
import { ValidateRequestBody } from "../utilities/Validate";
import {
  CreateSourceRequest,
  CreateSourceRequestSchema,
} from "#shared/types/CreateSourceRequest";
import { CastStringToObjectId } from "../utilities/Cast";
import { CreateSourceResponse } from "#shared/types/CreateSourceResponse";

export default defineEventHandler(
  async (event): Promise<CreateSourceResponse | ErrorResponse> => {
    const authorization = await Authorize(event);
    if (!authorization.success) return authorization.errorResponse;

    const bodyValidation = await ValidateRequestBody<CreateSourceRequest>(
      event,
      CreateSourceRequestSchema,
    );
    if (!bodyValidation.success) return bodyValidation.errorResponse;
    const body = bodyValidation.data;

    const originIdCast = CastStringToObjectId(event, body.originId);
    if (!originIdCast.success) return originIdCast.errorResponse;
    const originId = originIdCast.data;

    const userId = new mongoose.Types.ObjectId(authorization.data.userId);
    const sourceCreation = await createSource(
      originId,
      userId,
      body.credentials,
    );

    if (!sourceCreation.success) throw sourceCreation.error;

    setResponseStatus(event, 201);
    return { success: true, status: 201 };
  },
);
