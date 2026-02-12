import { RefreshRequest } from "#shared/types/RefreshRequest";
import { RefreshResponse } from "#shared/types/RefreshResponse";
import z from "zod";
import { refreshSession } from "~~/server/services/AuthorizationService";
import { ValidateRequestBody } from "~~/server/utilities/Validate";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";

const RefreshRequestSchema = z.object({ refreshToken: z.string() });

export default defineEventHandler(
  async (event): Promise<RefreshResponse | ErrorResponse> => {
    const validation = await ValidateRequestBody<
      z.infer<typeof RefreshRequestSchema>
    >(event, RefreshRequestSchema);
    if (!validation.success) return validation.errorResponse;

    const refreshToken = validation.data.refreshToken;

    const refreshAttempt = await refreshSession(refreshToken);
    if (!refreshAttempt.success) throw refreshAttempt.error;

    return {
      status: 200,
      success: true,
      accessToken: refreshAttempt.data.accessToken,
      refreshToken: refreshAttempt.data.session.refreshToken,
      accessTokenExpiration:
        refreshAttempt.data.accessTokenExpiration.toISOString(),
    };
  },
);
