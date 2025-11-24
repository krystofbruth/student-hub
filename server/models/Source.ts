import mongoose from "mongoose";
import { RegisteredServiceNames } from "../integrations/RegisteredServiceNames";

export interface ISource {
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
