import mongoose from "mongoose";

export interface ISession {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  details: object;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
