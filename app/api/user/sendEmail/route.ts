import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/utils/db';
import { Purchase } from '@/models/purchase';
import { Product } from '@/models/product';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { getEmailConfig } from '@/lib/config';
import { isRecord } from '@/lib/validation';
import { logError } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    const limited = await isRateLimited(`purchase-email:${user._id}`, {
      limit: 5,
      windowSeconds: 600,
      failClosed: true,
    });
    if (limited) {
      return apiError(429, 'Too many email requests. Please try again later.');
    }

    const body = await readJson(request);
    const purchaseId = isRecord(body) && typeof body.purchaseId === 'string' ? body.purchaseId : null;

    if (!purchaseId) {
      return apiError(400, 'A purchaseId is required');
    }

    await connectDB();

    const purchase = await Purchase.findOne({ _id: purchaseId, user: user._id, status: 'completed' });
    if (!purchase) {
      return apiError(404, 'Purchase not found');
    }

    if (purchase.emailSentAt) {
      return apiSuccess({ message: 'Confirmation email already sent' });
    }

    const emailConfig = getEmailConfig();
    if (!emailConfig) {
      logError('Email configuration is incomplete');
      return apiError(503, 'Email service is temporarily unavailable');
    }

    const product = await Product.findById(purchase.product).select('name').lean();
    const productName = product?.name || 'your reward';

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
      to: user.email,
      subject: 'Purchase Successful!',
      text: `Hi ${user.name || 'there'},

Your purchase of ${productName} was successful. ${purchase.tokens} tokens were deducted from your balance.

You will receive your reward within 3 working days. Keep flexing and burning calories.

Team FitVibe`,
    });

    purchase.emailSentAt = new Date();
    await purchase.save();

    return apiSuccess({ message: 'Confirmation email sent' });
  } catch (error) {
    logError('Failed to send purchase confirmation', error);
    return apiError(500, 'Unable to send confirmation email');
  }
}
