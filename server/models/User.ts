import mongoose from "mongoose";
import { SupportedLanguages } from "#shared/types/SupportedLanguages";

export enum UserState {
  REGISTERED = "REGISTERED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum CurrentEducation {
  primary = "primary",
  secondary = "secondary",
}

export interface IPersonalDetails {
  institution?: mongoose.Types.ObjectId;
  currentEducation?: CurrentEducation;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  displayName: string;
  state: UserState;
  username: string;
  lastSync: Date;
  language: SupportedLanguages;
  personalDetails: IPersonalDetails;
}

const personalDetailsSchema = new mongoose.Schema<IPersonalDetails>({
  institution: {
    type: mongoose.SchemaTypes.ObjectId,
    required: false,
  },
  currentEducation: {
    type: String,
    required: false,
    enum: CurrentEducation,
  },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: UserState,
    },
    lastSync: {
      type: Date,
      default: new Date(),
    },
    language: {
      type: String,
      required: true,
      enum: SupportedLanguages,
      default: SupportedLanguages.cs,
    },
    personalDetails: {
      type: personalDetailsSchema,
      default: {},
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
