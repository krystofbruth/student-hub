import mongoose from "mongoose";
import { EventType } from "./Event";

export interface IGroupEvent {
  _id: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  type: EventType;
}
