import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWishlist extends Document {
  user: Types.ObjectId;
  productIds: string[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    productIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);