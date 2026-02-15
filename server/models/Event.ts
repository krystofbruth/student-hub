import mongoose from "mongoose";
import { EventType } from "~~/shared/types/FetchEventsResponse";

export interface IEvent {
  _id: mongoose.Types.ObjectId;
  sourceId: mongoose.Types.ObjectId;
  type: EventType;
  dueAt: Date;
  uri: string;
  /** Id of the resource in the target implementation. */
  targetId: string;
  userId: mongoose.Types.ObjectId;
  title: Record<SupportedLanguages, string>;
  description?: Record<SupportedLanguages, string>;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    targetId: {
      type: String,
      required: true,
    },
    sourceId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Source",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: EventType,
    },
    dueAt: {
      type: Date,
    },
    uri: {
      type: String,
    },
    title: {
      type: {
        en: { type: String, required: true },
        cs: { type: String, required: true },
      },
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
