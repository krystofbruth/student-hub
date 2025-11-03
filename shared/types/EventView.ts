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

export const EventViewOpenAPISchema = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    sourceId: { type: "string", format: "ObjectId" },
    type: { type: "string" },
    dueAt: { type: "string", format: "date-time" },
    uri: { type: "string", format: "url" },
  },
};
