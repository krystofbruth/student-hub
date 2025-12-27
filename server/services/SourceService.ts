import mongoose from "mongoose";
import {
  IntegrationMap,
  RegisteredServiceNames,
  RequestDetails,
} from "../integrations/Integration";
import { ISource, Source } from "../models/Source";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";

export const createSource = async (
  serviceName: RegisteredServiceNames,
  userId: mongoose.Types.ObjectId,
  details: RequestDetails
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
