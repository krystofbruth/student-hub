import mongoose from "mongoose";

export enum UserState {
  REGISTERED = "REGISTERED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  email: string;
  passwordHash: string;
  displayName: string;
  state: UserState;
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
