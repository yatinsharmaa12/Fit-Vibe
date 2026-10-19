import connectDB from '@/utils/db';
import { Product } from '@/models/product';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api';
import { ensureProductsSeeded } from '@/lib/catalog';
import { logError } from '@/lib/logger';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return apiError(401, 'Authentication required');
    }

    await connectDB();
    await ensureProductsSeeded();

    const products = await Product.find({ active: true })
      .select('slug name description price image features')
      .sort({ price: 1 })
      .lean();

    return apiSuccess({ products });
  } catch (error) {
    logError('Failed to load products', error);
    return apiError(500, 'Unable to load products');
  }
}
