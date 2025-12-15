import mongoose from "mongoose";
import {
  IntegrationMap,
  RegisteredServiceNames,
  RequestDetails,
} from "../integrations/Integration";
import { ISource } from "../models/Source";
import { Result } from "../helpers/Result";

export const createSource = (
  serviceName: RegisteredServiceNames,
  userId: mongoose.Types.ObjectId,
  details: RequestDetails
): Promise<Result<ISource>> => {};
