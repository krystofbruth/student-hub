import mongoose from "mongoose";

export enum EventType {
  ASSIGNMENT = "ASSIGNMENT",
  ALTERNATION = "ALTERNATION",
  EXAM = "EXAM",
}

const eventSchema = new mongoose.Schema({
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
});

export const Event = mongoose.model("Event", eventSchema);
