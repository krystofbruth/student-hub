import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    get: (id: mongoose.Types.ObjectId) => id.toString(),
    set: (set: any) => {
      throw new Error("Violation: Id's are immutable");
    },
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("user", userSchema);
