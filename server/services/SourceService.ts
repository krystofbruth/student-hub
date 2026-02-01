import mongoose from "mongoose";
import {
  Integration,
  IntegrationMap,
  RegisteredIntegrationNames,
  RequestDetails,
} from "../models/Integration";
import { ISource, Source } from "../models/Source";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { NotFoundException } from "../exceptions/NotFoundException";

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
  serviceName: RegisteredIntegrationNames,
  userId: mongoose.Types.ObjectId,
  details: RequestDetails,
): Promise<Result<ISource>> => {
  try {
    const integration = await IntegrationMap[serviceName]();
    const credentialsAttempt = await integration.createSource(details);
    if (!credentialsAttempt.success) return credentialsAttempt;

    const source = new Source({
      userId,
      serviceName,
      credentials: credentialsAttempt.data,
    });
    await source.save();
    return { success: true, data: source };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const deleteSource = async (
  sourceId: mongoose.Types.ObjectId,
): Promise<Result<undefined>> => {
  try {
    const source = await Source.findById(sourceId);
    if (!source)
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
