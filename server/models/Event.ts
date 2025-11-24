import mongoose from "mongoose";

export enum EventType {
  ASSIGNMENT = "ASSIGNMENT",
  ALTERNATION = "ALTERNATION",
  EXAM = "EXAM",
}

export interface IEvent {
  _id: string;
  sourceId: mongoose.Types.ObjectId;
  type: EventType;
  dueAt: Date;
  uri: string;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    _id: {
      type: String,
      required: true,
      index: true,
    },
    sourceId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Source",
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
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
