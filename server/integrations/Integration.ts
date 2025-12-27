import mongoose from "mongoose";
import { IEvent } from "../models/Event";
import { useCajthamlIntegration } from "./CajthamlIntegration";
import { Result } from "../helpers/Result";

export enum RegisteredServiceNames {
  SSPS_CAJTHAML = "ssps_cajthaml",
  // etc.
}

export interface RequestDetails {
  body: unknown;
  headers: { [header: string]: string | undefined };
  query: { [parameter: string]: string | string[] | undefined };
  path: string;
}

export interface Integration {
  fetchEvents(
    credentials: Object,
    sourceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ): Promise<Result<IEvent[]>>;
  serviceName: RegisteredServiceNames;

  /** Returns login credentials to be saved in the DB. */
  createSource(event: RequestDetails): Promise<Result<any>>;

  unlinkSource(sourceId: mongoose.Types.ObjectId): Promise<void>;
}

type useIntegration = () => Promise<Integration>;

export const IntegrationMap: Record<RegisteredServiceNames, useIntegration> = {
  ssps_cajthaml: useCajthamlIntegration,
};
