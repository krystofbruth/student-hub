import z from "zod";
import { ValidateQueryParameters } from "../utilities/Validate";
import { getProviders } from "../services/ProviderService";
import {
  FetchProvidersResponse,
  ProviderView,
} from "~~/shared/types/FetchProvidersResponse";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import { IProvider } from "../models/Provider";

const queryParamsSchema = z.object({
  partnership: z.enum(["true", "false"]).optional(),
  limit: z.number().max(100).optional().default(50),
  offset: z.number().optional().default(0),
  query: z.string().max(99).optional().default(" "),
});

export const mapIProviderToProviderView = (
  provider: IProvider,
): ProviderView => {
  return {
    _id: provider._id.toString(),
    name: provider.name,
    city: provider.city,
    logoUri: provider.logoUri,
    logoUriDark: provider.logoUriDark,
  };
};

export default defineEventHandler(
  async (event): Promise<FetchProvidersResponse | ErrorResponse> => {
    const queryParse = await ValidateQueryParameters<
      z.infer<typeof queryParamsSchema>
    >(event, queryParamsSchema);
    if (!queryParse.success) return queryParse.errorResponse;

    let partnership: boolean | undefined;
    if (!(typeof queryParse.data.partnership === "undefined")) {
      if (queryParse.data.partnership === "true") partnership = true;
      else if (queryParse.data.partnership === "false") partnership = false;
    }
    const queryParsed = queryParse.data;

    const res = await getProviders(
      queryParsed.limit,
      queryParsed.offset,
      partnership,
      queryParsed.query,
    );
    if (!res.success) throw res.error;

    return {
      success: true,
      data: res.data.map((p) => mapIProviderToProviderView(p)),
    };
  },
);
