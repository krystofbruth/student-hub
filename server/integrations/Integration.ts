import mongoose from "mongoose";
import { IEvent } from "../models/Event";
import { useCajthamlIntegration } from "./CajthamlIntegration";
import { Result } from "../helpers/Result";

export enum RegisteredServiceNames {
  SSPS_CAJTHAML = "ssps_cajthaml",
  // etc.
}

export interface Integration {
  fetchEvents(
    credentials: Object,
    sourceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ): Promise<Result<IEvent[]>>;
  serviceName: RegisteredServiceNames;
}

type useIntegration = () => Promise<Integration>;

export const IntegrationMap: Record<RegisteredServiceNames, useIntegration> = {
  ssps_cajthaml: useCajthamlIntegration,
};
