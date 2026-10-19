import mongoose, { Document, Types } from 'mongoose';

export interface IPurchase extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  productSlug: string;
  tokens: number;
  status: 'completed' | 'refunded';
  emailSentAt?: Date;
  createdAt: Date;
}

const purchaseSchema = new mongoose.Schema<IPurchase>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productSlug: { type: String, required: true },
  tokens: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['completed', 'refunded'], default: 'completed' },
  emailSentAt: { type: Date },
}, {
  collection: 'fitvibe_purchases',
  timestamps: { createdAt: true, updatedAt: false },
});

purchaseSchema.index({ user: 1, createdAt: -1 });

export const Purchase =
  (mongoose.models.Purchase as mongoose.Model<IPurchase>) ||
  mongoose.model<IPurchase>('Purchase', purchaseSchema);
