import mongoose from "mongoose";
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import { IOrigin } from "./Origin";

export interface ISource {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  credentials: object;
  createdAt: Date;
  originId: mongoose.Types.ObjectId | IOrigin;
}

const sourceSchema = new mongoose.Schema<ISource>(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    credentials: {
      type: Object,
    },
    originId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Origin",
    },
  },
  { timestamps: true },
);

export const Source = mongoose.model("Source", sourceSchema);
