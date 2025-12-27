import z from "zod";
import { ImplementationException } from "../exceptions/ImplementationException";
import { Result } from "../helpers/Result";
import { IEvent } from "../models/Event";
import { type SSPSCajthamlLoginDetails } from "../models/integrations/ssps_cajthaml/LoginDetails";
import { CreateSSPSCajthamlSourceSchema } from "#shared/types/integrations/ssps_cajthaml/CreateSource";
import { ValidationException } from "../exceptions/ValidationException";
import {
  Integration,
  RegisteredServiceNames,
  RequestDetails,
} from "./Integration";
import mongoose from "mongoose";
import { UnknownException } from "../exceptions/UnknownException";
import { VerifySuccessDTO } from "../models/integrations/ssps_cajthaml/External-VerifySuccessDTO";

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

  private async performVerification(
    verificationToken: string
  ): Promise<Result<VerifySuccessDTO>> {
    try {
      const res = await fetch(
        `https://api.ssps.cajthaml.eu/verify/${verificationToken}`,
        { method: "GET" }
      );
      if (!res.ok) {
        if (res.status === 400)
          return {
            success: false,
            error: new ValidationException({
              verificationToken: ["Invalid verification token."],
            }),
          };
        throw res;
      }

      const body = (await res.json()) as VerifySuccessDTO;
      return { success: true, data: body };
    } catch (error) {
      return { success: false, error: new UnknownException(error) };
    }
  }

  public async createSource(
    details: RequestDetails
  ): Promise<Result<SSPSCajthamlLoginDetails>> {
    const validation = z.safeParse(
      CreateSSPSCajthamlSourceSchema,
      details.body
    );
    if (!validation.success)
      return {
        success: false,
        error: new ValidationException(
          z.flattenError(validation.error).fieldErrors
        ),
      };

    const verificationToken = validation.data.verificationToken;
    const vericationAttempt = await this.performVerification(verificationToken);
    if (!vericationAttempt.success) return vericationAttempt;

    return {
      success: true,
      data: { verificationToken, verification: vericationAttempt.data },
    };
  }

  unlinkSource(sourceId: mongoose.Types.ObjectId): Promise<void> {
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
