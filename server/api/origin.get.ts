import z from "zod";
import { ValidateQueryParameters } from "../utilities/Validate";
import { CastStringToObjectId } from "../utilities/Cast";
import mongoose from "mongoose";
import { getOrigins } from "../services/OriginService";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import {
  FetchOriginsResponse,
  OriginView,
} from "#shared/types/FetchOriginsResponse";
import { ProviderView } from "~~/shared/types/FetchProvidersResponse";
import { IProvider } from "../models/Provider";
import { IOrigin, OriginType } from "../models/Origin";
import { getProvider } from "../services/ProviderService";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { mapIProviderToProviderView } from "./provider.get";

const queryParams = z.object({
  limit: z.number().max(100).optional().default(50),
  offset: z.number().optional().default(0),
  providerId: z.string().optional(),
});

/** Must receive a populated origin! */
export const mapOriginToOriginView = (origin: IOrigin): OriginView => {
  let provider: ProviderView | undefined;
  if (
    origin.providerId &&
    !(origin.providerId instanceof mongoose.Types.ObjectId)
  ) {
    provider = mapIProviderToProviderView(origin.providerId);
  }

  return {
    _id: origin._id.toString(),
    provider: provider,
    integrationName: origin.integrationName,
    name: origin.name,
    description: origin.description,
    logoUri: origin.logoUri,
    logoUriDark: origin.logoUriDark,
    maxSources: origin.maxSources,
  };
};

export default defineEventHandler(
  async (event): Promise<FetchOriginsResponse | ErrorResponse> => {
    const queryValidation = await ValidateQueryParameters<
      z.infer<typeof queryParams>
    >(event, queryParams);
    if (!queryValidation.success) return queryValidation.errorResponse;

    let providerId: mongoose.Types.ObjectId | undefined = undefined;
    if (queryValidation.data.providerId) {
      const castAttempt = CastStringToObjectId(
        event,
        queryValidation.data.providerId,
      );
      if (!castAttempt.success) return castAttempt.errorResponse;
      providerId = castAttempt.data;
    }

    const res = await getOrigins(
      queryValidation.data.limit,
      queryValidation.data.offset,
      providerId,
    );
    if (!res.success) throw res.error;

    return {
      success: true,
      data: res.data.map((o) => mapOriginToOriginView(o)),
    };
  },
);
