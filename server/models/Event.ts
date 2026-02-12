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
  title: string;
  description: string;
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
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
