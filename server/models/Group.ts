import mongoose from "mongoose";

export interface IGroup {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
}

const groupSchema = new mongoose.Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
