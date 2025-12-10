import { type H3Event } from "h3";
import z from "zod";
import { ErrorCodes } from "#shared/types/ErrorResponse";
import { UtilityResult } from "./UtilityResult";

export async function ValidateRequestBody<T>(
  event: H3Event,
  schema: z.ZodObject
): Promise<UtilityResult<T>> {
  const validation = schema.safeParse(readBody(event));

  if (!validation.success)
    return {
      success: false,
      errorResponse: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: validation.error.message,
        status: 400,
        success: false,
      },
    };

  return { success: true, data: validation.data as T };
}
