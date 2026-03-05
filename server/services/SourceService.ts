import mongoose from "mongoose";
import { Integration, IntegrationMap } from "../models/Integration";
import { ISource, Source } from "../models/Source";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { getOrigin } from "./OriginService";
import { synchronize } from "./DataAggregationService";
import { LimitReachedException } from "../exceptions/LimitReachedException";

export const getSource = async (
  sourceId: mongoose.Types.ObjectId,
): Promise<Result<ISource>> => {
  try {
    const source = await Source.findById(sourceId);
    if (!source)
      return {
        success: false,
        error: new NotFoundException(sourceId.toString()),
      };
    return { success: true, data: source };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

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

    const sourcesOfOriginCount = await Source.countDocuments({
      originId: origin._id,
      userId,
    });
    if (sourcesOfOriginCount >= origin.maxSources)
      return {
        success: false,
        error: new LimitReachedException(origin.maxSources),
      };

    const integration = await IntegrationMap[origin.integrationName]();
    const credentialsAttempt = await integration.createSource(credentials);
    if (!credentialsAttempt.success) return credentialsAttempt;

    const source = new Source({
      userId,
      credentials: credentialsAttempt.data,
      originId: origin._id,
    });
    await source.save();
    await synchronize(userId.toString(), true);
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
    const source = await Source.findById(sourceId).populate("originId");
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

    if (source.originId instanceof mongoose.Types.ObjectId)
      return {
        success: false,
        error: new UnknownException(
          `Origin with id ${source.originId} doesn't exist, but tied to source ${source._id}`,
        ),
      };

    const integration: Integration =
      await IntegrationMap[source.originId.integrationName]();
    await integration.unlinkSource(source);
    await source.deleteOne();
    await synchronize(source.userId.toString(), true);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
