import { type H3Event } from "h3";
import z from "zod";
import {
  ErrorCodes,
  ValidationErrorResponse,
} from "#shared/types/ErrorResponse";
import { UtilityResult } from "./UtilityResult";

export async function ValidateRequestBody<T>(
  event: H3Event,
  schema: z.ZodObject
): Promise<UtilityResult<T>> {
  const validation = schema.safeParse(await readBody(event));

  if (!validation.success) {
    const errorResponse: ValidationErrorResponse = {
      code: ErrorCodes.VALIDATION_ERROR,
      message: "Validation error occured.",
      status: 400,
      success: false,
      issues: z.flattenError(validation.error).fieldErrors,
    };
    return { success: false, errorResponse };
  }

  return { success: true, data: validation.data as T };
}
