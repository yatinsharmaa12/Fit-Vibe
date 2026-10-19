import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Otp, { OTP_MAX_ATTEMPTS, OTP_TTL_SECONDS } from '@/models/otpModel';

export type OtpVerificationResult =
  | 'valid'
  | 'invalid'
  | 'expired'
  | 'not_found'
  | 'too_many_attempts';

export async function issueOtp(email: string): Promise<string> {
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email });
  await Otp.create({
    email,
    otpHash,
    expiresAt: new Date(Date.now() + OTP_TTL_SECONDS * 1000),
    attempts: 0,
  });

  return otp;
}

export async function verifyAndConsumeOtp(
  email: string,
  otp: string
): Promise<OtpVerificationResult> {
  const record = await Otp.findOne({ email }).sort({ createdAt: -1 });
  if (!record) return 'not_found';

  if (record.expiresAt.getTime() <= Date.now()) {
    await Otp.deleteOne({ _id: record._id });
    return 'expired';
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id });
    return 'too_many_attempts';
  }

  const matches = await bcrypt.compare(otp, record.otpHash);
  if (!matches) {
    await Otp.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
    return 'invalid';
  }

  const consumed = await Otp.deleteOne({ _id: record._id });
  return consumed.deletedCount === 1 ? 'valid' : 'not_found';
}
