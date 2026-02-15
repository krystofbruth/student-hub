import type { SupportedLanguages } from "./SupportedLanguages";

export enum EventType {
  ASSIGNMENT = "ASSIGNMENT",
  ALTERNATION = "ALTERNATION",
  EXAM = "EXAM",
}

export interface EventView {
  _id: string;
  sourceId: string;
  title: Record<SupportedLanguages, string>;
  /** EventType enum. */
  type: string;
  /** ISO Date. */
  dueAt: string;
  /** URI. */
  uri: string;
  description?: Record<SupportedLanguages, string>;
}

export interface FetchEventsResponse {
  success: true | "PARTIAL";
  code?: "SYNC_FAILURE";
  events: EventView[];
}
