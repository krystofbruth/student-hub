import mongoose from "mongoose";
import { UtilityResult } from "./UtilityResult";
import type { H3Event } from "h3";

export const CastStringToObjectId = (
  event: H3Event,
  input: string,
): UtilityResult<mongoose.Types.ObjectId> => {
  try {
    return { success: true, data: new mongoose.Types.ObjectId(input) };
  } catch (err) {
    const errorResponse: ValidationErrorResponse = {
      code: ErrorCodes.VALIDATION_ERROR,
      message: "Validation error occured: invalid query parameters.",
      status: 400,
      success: false,
      issues: { id: ["Not a valid ObjectId"] },
    };
    setResponseStatus(event, 400);
    return { success: false, errorResponse };
  }
};
