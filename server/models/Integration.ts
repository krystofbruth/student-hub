import mongoose from "mongoose";
import { IEvent } from "./Event";
import { useCajthamlIntegration } from "../integrations/CajthamlIntegration";
import { Result } from "../helpers/Result";
import { useTeamsIntegration } from "../integrations/TeamsIntegration";
import { ISource } from "./Source";
import { RegisteredIntegrationNames } from "#shared/types/RegisteredIntegrationNames";

export type EventWithoutId = Omit<IEvent, "_id">;

export interface Integration {
  fetchEvents(
    credentials: Object,
    sourceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<Result<EventWithoutId[]>>;
  serviceName: RegisteredIntegrationNames;

  /** Returns login credentials to be saved in the DB. */
  createSource(credentials: any): Promise<Result<any>>;

  /** Does necessary handling of graceful log-out before the source is deleted by the system. */
  unlinkSource(source: ISource): Promise<void>;
}

type useIntegration = () => Promise<Integration>;

export const IntegrationMap: Record<
  RegisteredIntegrationNames,
  useIntegration
> = {
  ssps_cajthaml: useCajthamlIntegration,
  teams: useTeamsIntegration,
};

/** Add to every request! */
export const USER_AGENT = `StudentHub/${
  useRuntimeConfig().appVersion
} (bruthans.krystof11@gmail.com)`;
