export interface EventView {
  _id: string;
  sourceId: string;
  /** EventType enum. */
  type: string;
  /** ISO Date. */
  dueAt: string;
  /** URI. */
  uri: string;
}

export interface FetchEventsResponse {
  success: true | "PARTIAL";
  code?: "SYNC_FAILURE";
  events: EventView[];
}
