import mongoose from "mongoose";

export enum GroupRoles {
  OWNER = "OWNER",
  CONTRIBUTOR = "CONTRIBUTOR",
  SUBSCRIBER = "SUBSCRIBER",
}

export interface IGroupMembership {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  role: GroupRoles;
}

const groupMembershipSchema = new mongoose.Schema<IGroupMembership>({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  groupId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Group",
    required: true,
  },
  role: {
    type: String,
    enum: GroupRoles,
    required: true,
  },
});

export const GroupMembership = mongoose.model(
  "GroupMembership",
  groupMembershipSchema
);
