import z from "zod";
import { ImplementationException } from "../exceptions/ImplementationException";
import type { Result } from "../helpers/Result";
import type { SSPSCajthamlLoginDetails } from "../models/integrations/ssps_cajthaml/LoginDetails";
import { CreateSSPSCajthamlSourceSchema } from "#shared/types/integrations/ssps_cajthaml/CreateSource";
import { ValidationException } from "../exceptions/ValidationException";
import type {
  EventWithoutId,
  Integration,
  RequestDetails,
} from "../models/Integration";
import { USER_AGENT } from "../models/Integration";
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import type mongoose from "mongoose";
import { UnknownException } from "../exceptions/UnknownException";
import type { VerifySuccessDTO } from "../models/integrations/ssps_cajthaml/External-VerifySuccessDTO";
import type { AllUserWorkSuccessDTO } from "../models/integrations/ssps_cajthaml/External-AllUserWorkSuccessDTO";
import { EventType } from "../models/Event";
import { ISource } from "../models/Source";

class CajthamlIntegration implements Integration {
  public serviceName: RegisteredIntegrationNames;

  constructor() {
    this.serviceName = RegisteredIntegrationNames.SSPS_CAJTHAML;
  }

  public async fetchEvents(
    credentials: object,
    sourceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<Result<EventWithoutId[]>> {
    const cajthamlCredentials = credentials as SSPSCajthamlLoginDetails;

    try {
      const res = await fetch(
        `https://api.ssps.cajthaml.eu/user/${cajthamlCredentials.verification.user.id}/work`,
        {
          method: "GET",
          headers: {
            "x-verify-code": cajthamlCredentials.verificationToken,
            "User-Agent": USER_AGENT,
          },
        },
      );
      if (!res.ok) throw res;

      const events = (await res.json()).data as AllUserWorkSuccessDTO;
      return {
        success: true,
        data: events.works.map((e) => {
          return {
            sourceId,
            type: EventType.ASSIGNMENT,
            dueAt: new Date(e.end),
            uri: `https://ssps.cajthaml.eu/${e.subjectSlug}/work/${e.slug}`,
            targetId: e.id,
            userId,
            title: e.name,
            description: "",
          };
        }),
      };
    } catch (error) {
      return { success: false, error: new UnknownException(error) };
    }
  }

  private async performVerification(
    verificationToken: string,
  ): Promise<Result<VerifySuccessDTO>> {
    try {
      const res = await fetch(
        `https://api.ssps.cajthaml.eu/verify/${verificationToken}`,
        { method: "GET", headers: { "User-Agent": USER_AGENT } },
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

      const body = (await res.json()).data as VerifySuccessDTO;
      return { success: true, data: body };
    } catch (error) {
      return { success: false, error: new UnknownException(error) };
    }
  }

  public async createSource(
    details: RequestDetails,
  ): Promise<Result<SSPSCajthamlLoginDetails>> {
    const validation = z.safeParse(
      CreateSSPSCajthamlSourceSchema,
      details.body,
    );
    if (!validation.success)
      return {
        success: false,
        error: new ValidationException(
          z.flattenError(validation.error).fieldErrors,
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

  public async unlinkSource(source: ISource): Promise<void> {
    // Only forgetting the Auth token enough for now.
    return undefined;
  }
}

let cajthamlIntegration: Integration | undefined = undefined;

export const useCajthamlIntegration = async () => {
  if (typeof cajthamlIntegration !== "undefined") return cajthamlIntegration;

  // Setup
  cajthamlIntegration = new CajthamlIntegration();
  return cajthamlIntegration;
};
