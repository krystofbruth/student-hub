import mongoose from "mongoose";
import { EventType } from "#shared/types/FetchEventsResponse";

export interface IGroupEvent {
  _id: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  type: EventType;
}
