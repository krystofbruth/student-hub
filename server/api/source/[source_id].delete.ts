import { getRouterParam, setResponseStatus } from "h3";
import mongoose from "mongoose";
import { Authorize } from "~~/server/utilities/Authorize";
import { deleteSource } from "~~/server/services/SourceService";
import { CastStringToObjectId } from "~~/server/utilities/Cast";
import {
  ErrorCodes,
  type ErrorResponse,
  type ValidationErrorResponse,
} from "~~/shared/types/ErrorResponse";

export default defineEventHandler(
  async (event): Promise<void | ErrorResponse | ValidationErrorResponse> => {
    const authorization = await Authorize(event);
    if (!authorization.success) return authorization.errorResponse;

    const sourceIdParam = getRouterParam(event, "source_id");
    if (!sourceIdParam) {
      setResponseStatus(event, 400);
      return {
        success: false,
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Validation error occured: missing source_id.",
        status: 400,
        issues: { source_id: ["Path parameter source_id is required"] },
      };
    }

    const sourceIdCast = CastStringToObjectId(sourceIdParam);
    if (!sourceIdCast.success) return sourceIdCast.errorResponse;
    const sourceId = sourceIdCast.data;

    const userId = new mongoose.Types.ObjectId(authorization.data.userId);
    const result = await deleteSource(sourceId, userId);

    if (!result.success) throw result.error;

    setResponseStatus(event, 204);
  },
);
