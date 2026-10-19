import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { verifyAndConsumeOtp } from '@/lib/otp';
import { getClientIp, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { isRecord, normalizeEmail, validateName, validateOtp, validatePassword } from '@/lib/validation';
import { logError } from '@/lib/logger';

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  otp?: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const body = await readJson<RegisterBody>(req);
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const name = validateName(body.name);
    const email = normalizeEmail(body.email);
    const otp = validateOtp(body.otp);
    const passwordErrors = validatePassword(body.password);

    if (!name || !email || !otp || passwordErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid registration details',
          details: passwordErrors,
        },
        { status: 400 }
      );
    }

    const limited = await isRateLimited(`register:${getClientIp(req)}`, {
      limit: 10,
      windowSeconds: 3600,
      failClosed: true,
    });
    if (limited) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const otpResult = await verifyAndConsumeOtp(email, otp);
    if (otpResult !== 'valid') {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(body.password as string, 10);

    try {
      await User.create({
        name,
        email,
        password: hashedPassword,
        provider: 'credentials',
      });
    } catch (error) {
      if (isRecord(error) && error.code === 11000) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
      logError('Failed to create user', error);
      return NextResponse.json({ error: 'Unable to create account' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    logError('Registration failed', error);
    return NextResponse.json({ error: 'Unable to complete registration' }, { status: 500 });
  }
}
