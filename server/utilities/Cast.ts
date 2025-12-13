import mongoose from "mongoose";
import { UtilityResult } from "./UtilityResult";

export const CastStringToObjectId = (
  input: string
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
    return { success: false, errorResponse };
  }
};
