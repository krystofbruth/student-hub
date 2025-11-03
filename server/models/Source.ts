import mongoose from "mongoose";
import { RegisteredServiceNames } from "../integrations/RegisteredServiceNames";

const sourceSchema = new mongoose.Schema({
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
});

export const Source = mongoose.model("Source", sourceSchema);
