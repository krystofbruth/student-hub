import mongoose from "mongoose";
import { IEvent } from "../models/Event";
import { useCajthamlIntegration } from "./CajthamlIntegration";
import { Result } from "../helpers/Result";
import { ISource } from "../models/Source";

export enum RegisteredServiceNames {
  SSPS_CAJTHAML = "ssps_cajthaml",
  // etc.
}

export interface RequestDetails {
  body: object;
  headers: object;
  query: object;
  path: string;
}

export interface Integration {
  fetchEvents(
    credentials: Object,
    sourceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ): Promise<Result<IEvent[]>>;
  serviceName: RegisteredServiceNames;

  createSource(event: RequestDetails): Promise<ISource>;

  unlinkSource(sourceId: mongoose.Types.ObjectId): Promise<void>;
}

type useIntegration = () => Promise<Integration>;

export const IntegrationMap: Record<RegisteredServiceNames, useIntegration> = {
  ssps_cajthaml: useCajthamlIntegration,
};
