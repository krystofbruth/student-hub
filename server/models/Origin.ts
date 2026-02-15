import mongoose from "mongoose";
import { RegisteredIntegrationNames } from "~~/shared/types/RegisteredIntegrationNames";
import { IProvider } from "./Provider";

export enum OriginType {
  universal = "universal",
  institutional = "institutional",
}

export interface IOrigin {
  _id: mongoose.Types.ObjectId;
  integrationName: RegisteredIntegrationNames;
  type: OriginType;
  /** Only present if `type` is set to `institutional`. */
  providerId?: mongoose.Types.ObjectId | IProvider;
  name: {
    en: string;
    cs: string;
  };
  description: {
    en: string;
    cs: string;
  };
  logoUri: string;
  logoUriDark?: string;
  credentials?: any;
}

const originSchema = new mongoose.Schema<IOrigin>({
  integrationName: {
    type: String,
    required: true,
    enum: RegisteredIntegrationNames,
  },
  type: {
    type: String,
    required: true,
    enum: OriginType,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: false, // optional (this is actually the default)
  },
  name: {
    cs: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
  },
  description: {
    cs: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
  },
  logoUri: {
    type: String,
    required: true,
  },
  logoUriDark: {
    type: String,
    required: false,
  },
  credentials: {
    type: Object,
    required: false,
  },
});

export const Origin = mongoose.model("Origin", originSchema);
