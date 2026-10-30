import mongoose, { Schema, Document, Types } from "mongoose";

interface IAddressEntry {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface IAddressBook extends Document {
  user: Types.ObjectId;
  addresses: IAddressEntry[];
}

const addressEntrySchema = new Schema<IAddressEntry>(
  {
    id: { type: String, required: true },
    label: { type: String, default: "" },
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const addressBookSchema = new Schema<IAddressBook>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    addresses: { type: [addressEntrySchema], default: [] },
  },
  { timestamps: true }
);

export const AddressBook = mongoose.model<IAddressBook>("AddressBook", addressBookSchema);