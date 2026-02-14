import mongoose from "mongoose";
import { Integration, IntegrationMap } from "../models/Integration";
import { ISource, Source } from "../models/Source";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { getOrigin } from "./OriginService";

export const listSources = async (
  userId: mongoose.Types.ObjectId,
): Promise<Result<ISource[]>> => {
  try {
    const sources = await Source.find({ userId }).populate({
      path: "originId",
      populate: {
        path: "providerId",
        model: "Provider",
      },
    });
    return { success: true, data: sources };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const createSource = async (
  originId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  credentials: unknown,
): Promise<Result<ISource>> => {
  try {
    const originLookup = await getOrigin(originId);
    if (!originLookup.success) return originLookup;

    const origin = originLookup.data;

    const integration = await IntegrationMap[origin.integrationName]();
    const credentialsAttempt = await integration.createSource(credentials);
    if (!credentialsAttempt.success) return credentialsAttempt;

    const source = new Source({
      userId,
      credentials: credentialsAttempt.data,
      originId: origin._id,
    });
    await source.save();
    return { success: true, data: source };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const deleteSource = async (
  sourceId: mongoose.Types.ObjectId,
  userId?: mongoose.Types.ObjectId,
): Promise<Result<undefined>> => {
  try {
    const source = await Source.findById(sourceId);
    if (!source)
      return {
        success: false,
        error: new NotFoundException(sourceId.toString()),
      };

    if (userId && !source.userId.equals(userId))
      return {
        success: false,
        error: new NotFoundException(sourceId.toString()),
      };

    const integration: Integration = await IntegrationMap[source.serviceName]();
    await integration.unlinkSource(source);
    await source.deleteOne();
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
