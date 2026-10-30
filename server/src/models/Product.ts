import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  color: string;
  size: string;
  sku: string;
  stock: number;
  priceModifier: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  occasionTags: string[];
  basePrice: number;
  images: string[];
  variants: IVariant[];
  customizable: boolean;
  createdAt: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0 },
    priceModifier: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    occasionTags: { type: [String], default: [] },
    basePrice: { type: Number, required: true },
    images: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    customizable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);