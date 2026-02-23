import { Types } from "mongoose";
import { Result } from "../helpers/Result";
import { EventWithoutId, Integration } from "../models/Integration";
import { ISource } from "../models/Source";
import { getSource } from "../services/SourceService";
import { IOrigin } from "../models/Origin";
import { getOrigin } from "../services/OriginService";
import { NotFoundException } from "../exceptions/NotFoundException";
import { UnknownException } from "../exceptions/UnknownException";
import { ThirdPartyApiException } from "../exceptions/ThirdPartyApiException";
import {
  ChangeTypes,
  SubstitutionsResponse,
} from "../models/integrations/bakalari/External-SubstitutionsResponse";
import { BakalariOriginCredentials } from "../models/integrations/bakalari/BakalariCredentials";
import { Provider } from "../models/Provider";

interface Change {
  description: Record<SupportedLanguages, string>;
  hour: number;
}

interface Substitutions {
  className: string;
  subsitutions: Change[];
}

const translations: Record<SupportedLanguages, Record<ChangeTypes, string>> = {
  cs: {
    [ChangeTypes.CANCELLED]: "odpadá",
    [ChangeTypes.SUPPLEMENTING]: "supluje",
    [ChangeTypes.MOVED]: "přesun",
    [ChangeTypes.MERGED]: "spojí",
  },
  en: {
    [ChangeTypes.CANCELLED]: "cancelled",
    [ChangeTypes.SUPPLEMENTING]: "supplementing",
    [ChangeTypes.MOVED]: "moved",
    [ChangeTypes.MERGED]: "merged",
  },
};

const hourTranslation: Record<SupportedLanguages, string> = {
  cs: "hodina",
  en: "hour",
};

class BakalariIntegration implements Integration {
  public serviceName: RegisteredIntegrationNames;

  constructor() {
    this.serviceName = RegisteredIntegrationNames.BAKALARI;
  }

  public async fetchEvents(
    credentials: Object,
    sourceId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Result<EventWithoutId[]>> {
    const sourceLookup = await getSource(sourceId);
    if (!sourceLookup.success) return sourceLookup;

    const source = sourceLookup.data;

    // Fetching origin
    let origin: IOrigin;
    if (source.originId instanceof Types.ObjectId) {
      const originLookup = await getOrigin(source.originId);
      if (!originLookup.success) {
        if (originLookup.error instanceof NotFoundException)
          return {
            success: false,
            error: new UnknownException(
              `Source ${sourceId} referring to a non-existent origin ${source.originId}`,
            ),
          };
        else return originLookup;
      }

      origin = originLookup.data;
    } else {
      origin = source.originId;
    }

    if (!origin.credentials)
      return {
        success: false,
        error: new UnknownException(
          `Origin ${origin._id} does not contain any origin specific credentials for Bakalari!`,
        ),
      };

    try {
      const originCredentials = origin.credentials as BakalariOriginCredentials;

      const usernamePasswordRaw = `${originCredentials.username}:${originCredentials.password}`;
      const encodedUsernamePassword = Buffer.from(
        usernamePasswordRaw,
        "utf-8",
      ).toString("base64");
      const authorization = `Basic ${encodedUsernamePassword}`;

      const date = this.getStartingMonday();
      // const date = new Date("2026-02-10");

      const events: EventWithoutId[] = [];

      for (let i = 0; i < 5; i++) {
        const formattedDate = date
          .toISOString()
          .replace(/T.+/, "")
          .replaceAll(/-/g, "");

        date.setDate(date.getDate() + 1);

        const res = await fetch(
          `${originCredentials.baseUri}/substitutions/public/${formattedDate}`,
          {
            headers: {
              Authorization: authorization,
              Accept: "application/json",
            },
          },
        );
        if (!res.ok || res.headers.get("Content-Type") !== "application/json")
          return {
            success: false,
            error: new ThirdPartyApiException(
              RegisteredIntegrationNames.BAKALARI,
              origin._id.toString(),
              res,
            ),
          };

        const body = (await res.json()) as SubstitutionsResponse;

        const descriptions = this.createSubstitutionsDescription(body);

        const descriptionsFinalized: Record<SupportedLanguages, string> = {
          en: "",
          cs: "",
        };

        for (const description of descriptions) {
          let substitutionsStringEn = "";
          let substitutionsStringCs = "";
          for (const sub of description.subsitutions) {
            substitutionsStringEn = `${substitutionsStringEn}\n\n${sub.description["en"]}`;
            substitutionsStringCs = `${substitutionsStringCs}\n\n${sub.description["cs"]}`;
          }

          descriptionsFinalized.en = `${descriptionsFinalized.en}**${description.className}**\n${substitutionsStringEn}\n\n---\n\n`;
          descriptionsFinalized.cs = `${descriptionsFinalized.cs}**${description.className}**\n${substitutionsStringCs}\n\n---\n\n`;
        }

        const event: EventWithoutId = {
          sourceId,
          type: EventType.ALTERNATION,
          dueAt: date,
          uri: originCredentials.publicUri,
          targetId: formattedDate,
          userId,
          title: {
            en: `Timetable alternations`,
            cs: "Změny v rozvrhu",
          },
          description: descriptionsFinalized,
        };

        events.push(event);
      }

      return { success: true, data: events };
    } catch (error) {
      return { success: false, error: new UnknownException(error) };
    }
  }
  public async createSource(credentials: any): Promise<Result<any>> {
    // Doesn't return any specific user info at this time.
    return { success: true, data: undefined };
  }
  public async unlinkSource(source: ISource): Promise<void> {
    return;
  }

  private mapHourToIndex(hourLabels: string[], hour: string): number {
    const index = hourLabels.findIndex((p) => p === hour);
    return index;
  }

  private createSubstitutionsDescription(
    substitutionsResponse: SubstitutionsResponse,
  ): Substitutions[] {
    const subsitutions: Substitutions[] = [];

    for (const classValue of substitutionsResponse.ChangesForClasses) {
      const changes: Change[] = [];
      for (const lesson of classValue.ChangedLessons) {
        const hourIndex = this.mapHourToIndex(
          substitutionsResponse.HourLabels,
          lesson.Hour,
        );
        const descriptions = {
          cs: `${lesson.Hour}. ${hourTranslation.cs} ${lesson.Subject}${lesson.Group.length > 0 ? `-${lesson.Group}` : ""} ${translations.cs[lesson.ChgType1]} ${lesson.Teacher}`,
          en: `${lesson.Hour}. ${hourTranslation.en} ${lesson.Subject}${lesson.Group.length > 0 ? `-${lesson.Group}` : ""} ${translations.en[lesson.ChgType1]} ${lesson.Teacher}`,
        };
        changes.push({ hour: hourIndex, description: descriptions });
      }

      for (const lesson of classValue.CancelledLessons) {
        const hourIndex = this.mapHourToIndex(
          substitutionsResponse.HourLabels,
          lesson.Hour,
        );
        const descriptions = {
          cs: `${lesson.Hour}. ${hourTranslation.cs} ${lesson.Subject}${lesson.Group.length > 0 ? `-${lesson.Group}` : ""} ${translations.cs[lesson.ChgType1]}`,
          en: `${lesson.Hour}. ${hourTranslation.en} ${lesson.Subject}${lesson.Group.length > 0 ? `-${lesson.Group}` : ""} ${translations.en[lesson.ChgType1]}`,
        };
        changes.push({ hour: hourIndex, description: descriptions });
      }

      // I totally don't understand this, let's put it on the top for now.
      for (const changedGroup of classValue.ChangedGroups) {
        changes.push({
          hour: -1,
          description: { en: changedGroup, cs: changedGroup },
        });
      }

      changes.sort((a, b) => a.hour - b.hour);

      subsitutions.push({
        className: classValue.Class.Abbrev,
        subsitutions: changes,
      });
    }

    return subsitutions;
  }

  private getStartingMonday(): Date {
    const today = new Date();

    const monday: Date = new Date();
    if (today.getDay() === 0) {
      monday.setDate(today.getDate() + 1);
    } else if (today.getDay() === 6) {
      monday.setDate(today.getDate() + 2);
    } else {
      monday.setDate(monday.getDate() - monday.getDay() + 1);
    }

    return monday;
  }
}

let bakalariIntegration: BakalariIntegration | undefined = undefined;

export const useBakalariIntegration = async () => {
  if (typeof bakalariIntegration !== "undefined") return bakalariIntegration;

  bakalariIntegration = new BakalariIntegration();
  return bakalariIntegration;
};
