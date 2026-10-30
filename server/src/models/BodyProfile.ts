import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBodyProfile extends Document {
  user: Types.ObjectId;
  height: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  inseam: string;
  preferredFit: "Snug" | "Regular" | "Relaxed";
  preferredSize: string;
  completed: boolean;
}

const bodyProfileSchema = new Schema<IBodyProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    height: { type: String, default: "" },
    bust: { type: String, default: "" },
    waist: { type: String, default: "" },
    hip: { type: String, default: "" },
    shoulder: { type: String, default: "" },
    inseam: { type: String, default: "" },
    preferredFit: { type: String, enum: ["Snug", "Regular", "Relaxed"], default: "Regular" },
    preferredSize: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BodyProfile = mongoose.model<IBodyProfile>("BodyProfile", bodyProfileSchema);