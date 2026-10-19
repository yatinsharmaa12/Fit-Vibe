import mongoose, { Schema, model, models } from 'mongoose';

export const OTP_TTL_SECONDS = 5 * 60;
export const OTP_MAX_ATTEMPTS = 5;

export interface IOtp {
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
  attempts: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

OtpSchema.index({ email: 1, createdAt: -1 });

const Otp = (models.Otp as mongoose.Model<IOtp>) || model<IOtp>('Otp', OtpSchema);

export default Otp;
