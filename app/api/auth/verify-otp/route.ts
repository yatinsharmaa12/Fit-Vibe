import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { verifyAndConsumeOtp } from '@/lib/otp';
import { getClientIp, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { normalizeEmail, validateOtp, isRecord } from '@/lib/validation';
import { logError } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await readJson(req);
    const email = isRecord(body) ? normalizeEmail(body.email) : null;
    const otp = isRecord(body) ? validateOtp(body.otp) : null;

    if (!email || !otp) {
      return NextResponse.json(
        { valid: false, error: 'Invalid OTP or email' },
        { status: 400 }
      );
    }

    const limited = await isRateLimited(`otp-verify:${getClientIp(req)}`, {
      limit: 10,
      windowSeconds: 300,
      failClosed: true,
    });
    if (limited) {
      return NextResponse.json(
        { valid: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();
    const result = await verifyAndConsumeOtp(email, otp);

    if (result === 'valid') {
      return NextResponse.json({ valid: true, message: 'OTP verified successfully' });
    }

    return NextResponse.json(
      { valid: false, error: 'Invalid or expired OTP' },
      { status: 400 }
    );
  } catch (error) {
    logError('Error verifying OTP', error);
    return NextResponse.json({ valid: false, error: 'Unable to verify OTP' }, { status: 500 });
  }
}
