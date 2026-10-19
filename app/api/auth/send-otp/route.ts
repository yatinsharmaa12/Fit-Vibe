import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/utils/db';
import { issueOtp } from '@/lib/otp';
import { getEmailConfig, isProduction } from '@/lib/config';
import { getClientIp, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { normalizeEmail, isRecord } from '@/lib/validation';
import { logError, logInfo } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  const email = isRecord(body) ? normalizeEmail(body.email) : null;

  if (!email) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  const ip = getClientIp(req);
  const [ipLimited, emailLimited] = await Promise.all([
    isRateLimited(`otp:ip:${ip}`, { limit: 5, windowSeconds: 600, failClosed: true }),
    isRateLimited(`otp:email:${email}`, { limit: 3, windowSeconds: 600, failClosed: true }),
  ]);

  if (ipLimited || emailLimited) {
    return NextResponse.json(
      { error: 'Too many OTP requests. Please try again later.' },
      { status: 429 }
    );
  }

  let otp: string;
  try {
    await connectDB();
    otp = await issueOtp(email);
  } catch (error) {
    logError('Failed to issue OTP', error);
    return NextResponse.json({ error: 'Unable to send OTP right now' }, { status: 500 });
  }

  const emailConfig = getEmailConfig();

  if (!emailConfig) {
    if (!isProduction()) {
      logInfo('OTP generated (email not configured, dev fallback)', { email, otp });
      return NextResponse.json({
        message: 'Email is not configured. Use the development OTP shown below.',
        devOtp: otp,
      });
    }
    logError('Email configuration is incomplete');
    return NextResponse.json(
      { error: 'Email service is temporarily unavailable' },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      requireTLS: emailConfig.requireTLS,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    await transporter.sendMail({
      from: emailConfig.user,
      to: email,
      subject: 'Your FitVibe verification code',
      text: `Your FitVibe verification code is ${otp}. It expires in 5 minutes.`,
    });

    return NextResponse.json({ message: 'If the address is valid, an OTP has been sent.' });
  } catch (error) {
    logError('Failed to send OTP email', error);
    if (!isProduction()) {
      logInfo('Falling back to development OTP', { email, otp });
      return NextResponse.json({
        message: 'Email delivery failed. Use the development OTP shown below.',
        devOtp: otp,
      });
    }
    return NextResponse.json({ error: 'Unable to send OTP right now' }, { status: 500 });
  }
}
