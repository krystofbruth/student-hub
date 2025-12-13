import { ImplementationException } from "../exceptions/ImplementationException";
import { Result } from "../helpers/Result";
import { IEvent } from "../models/Event";
import { Integration, RegisteredServiceNames } from "./Integration";
import mongoose from "mongoose";

class CajthamlIntegration implements Integration {
  public serviceName: RegisteredServiceNames;

  constructor() {
    this.serviceName = RegisteredServiceNames.SSPS_CAJTHAML;
  }

  fetchEvents(
    credentials: Object,
    sourceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ): Promise<Result<IEvent[]>> {
    // TODO
    throw new ImplementationException("SSPS Cajthaml not yet implemented.");
  }
}

let cajthamlIntegration: Integration | undefined = undefined;

export const useCajthamlIntegration = async () => {
  if (typeof cajthamlIntegration !== "undefined") return cajthamlIntegration;

  // Setup
  cajthamlIntegration = new CajthamlIntegration();
  return cajthamlIntegration;
};
