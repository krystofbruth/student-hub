import mongoose from "mongoose";

export enum InstitutionType {
  education = "education",
}

export interface IProvider {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  name: string;
  institution: InstitutionType;
  city: string;
  logoUri: string;
  logoUriDark?: string;
  partnership: boolean;
}

const providerSchema = new mongoose.Schema<IProvider>(
  {
    name: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
      enum: InstitutionType,
    },
    city: {
      type: String,
      required: true,
    },
    logoUri: {
      type: String,
      required: true,
    },
    logoUriDark: {
      type: String,
      required: false,
    },
    partnership: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

export const Provider = mongoose.model("Provider", providerSchema);
