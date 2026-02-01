import mongoose from "mongoose";
import { Authorize } from "../utilities/Authorize";
import { listSources } from "../services/SourceService";
import { ErrorResponse } from "~~/shared/types/ErrorResponse";
import {
  ListSourcesResponse,
  SourceView,
} from "#shared/types/ListSourcesResponse";
import { ISource } from "../models/Source";
import { mapOriginToOriginView } from "./origin.get";

const mapSourceToSourceView = (source: ISource): SourceView => {
  if (source.originId instanceof mongoose.Types.ObjectId)
    throw new Error("Source not populated!");
  return {
    _id: source._id.toString(),
    userId: source.userId.toString(),
    serviceName: source.serviceName,
    createdAt: source.createdAt.toISOString(),
    origin: mapOriginToOriginView(source.originId),
  };
};

export default defineEventHandler(
  async (event): Promise<ListSourcesResponse | ErrorResponse> => {
    const authorization = await Authorize(event);
    if (!authorization.success) return authorization.errorResponse;

    const userId = new mongoose.Types.ObjectId(authorization.data.userId);

    const result = await listSources(userId);
    if (!result.success) throw result.error;

    return {
      success: true,
      data: result.data.map((s) => mapSourceToSourceView(s)),
    };
  },
);
