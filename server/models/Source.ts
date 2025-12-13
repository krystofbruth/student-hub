import mongoose from "mongoose";
import { RegisteredServiceNames } from "../integrations/Integration";

export interface ISource {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceName: RegisteredServiceNames;
  credentials: object;
}

const sourceSchema = new mongoose.Schema<ISource>(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    serviceName: {
      type: String,
      required: true,
      enum: RegisteredServiceNames,
    },
    credentials: {
      type: Object,
    },
  },
  { timestamps: true }
);

export const Source = mongoose.model("Source", sourceSchema);
