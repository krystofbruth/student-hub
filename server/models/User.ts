import mongoose from "mongoose";

export enum UserState {
  REGISTERED = "REGISTERED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  displayName: string;
  state: UserState;
  username: string;
}

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
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
