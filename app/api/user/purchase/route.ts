import { NextRequest } from 'next/server';
import { Types } from 'mongoose';
import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { Product } from '@/models/product';
import { Purchase } from '@/models/purchase';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess, getClientIp, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { ensureProductsSeeded } from '@/lib/catalog';
import { isRecord } from '@/lib/validation';
import { logError } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    const limited = await isRateLimited(`purchase:${user._id}:${getClientIp(request)}`, {
      limit: 20,
      windowSeconds: 600,
      failClosed: true,
    });
    if (limited) {
      return apiError(429, 'Too many purchase attempts. Please try again later.');
    }

    const body = await readJson(request);
    const productId = isRecord(body) && typeof body.productId === 'string' ? body.productId.trim() : null;

    if (!productId) {
      return apiError(400, 'A productId is required');
    }

    await connectDB();
    await ensureProductsSeeded();

    const product = Types.ObjectId.isValid(productId)
      ? await Product.findOne({ _id: productId, active: true })
      : await Product.findOne({ slug: productId.toLowerCase(), active: true });

    if (!product) {
      return apiError(404, 'Product not found');
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, token: { $gte: product.price } },
      { $inc: { token: -product.price } },
      { new: true }
    )
      .select('token')
      .lean();

    if (!updatedUser) {
      return apiError(409, 'Insufficient tokens');
    }

    const purchase = await Purchase.create({
      user: user._id,
      product: product._id,
      productSlug: product.slug,
      tokens: product.price,
      status: 'completed',
    });

    return apiSuccess({
      message: 'Purchase completed',
      purchaseId: purchase._id.toString(),
      remainingTokens: updatedUser.token,
      product: {
        slug: product.slug,
        name: product.name,
        price: product.price,
      },
    });
  } catch (error) {
    logError('Purchase failed', error);
    return apiError(500, 'Unable to complete purchase');
  }
}
