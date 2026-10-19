import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  slug: string;
  name: string;
  image?: string;
  description: string;
  price: number;
  features: string[];
  active: boolean;
}

const productSchema = new mongoose.Schema<IProduct>({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  image: String,
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  features: [{ type: String }],
  active: { type: Boolean, default: true },
}, {
  collection: 'fitvibe_products',
  timestamps: true,
});

export const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>('Product', productSchema);
