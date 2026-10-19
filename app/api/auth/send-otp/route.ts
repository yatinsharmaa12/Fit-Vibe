import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/utils/db';
import { issueOtp } from '@/lib/otp';
import { getEmailConfig } from '@/lib/config';
import { getClientIp, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { normalizeEmail, isRecord } from '@/lib/validation';
import { logError } from '@/lib/logger';

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

  const emailConfig = getEmailConfig();
  if (!emailConfig) {
    logError('Email configuration is incomplete');
    return NextResponse.json(
      { error: 'Email service is temporarily unavailable' },
      { status: 503 }
    );
  }

  try {
    await connectDB();
    const otp = await issueOtp(email);

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
    logError('Failed to send OTP', error);
    return NextResponse.json({ error: 'Unable to send OTP right now' }, { status: 500 });
  }
}
