import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/utils/db';
import { User } from '@/models/user';
import { getSessionUser } from '@/lib/auth';
import { apiError, apiSuccess, readJson } from '@/lib/api';
import { isRateLimited } from '@/lib/rate-limit';
import { isRecord, validateName, validatePassword } from '@/lib/validation';
import { logError } from '@/lib/logger';

export async function PUT(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return apiError(401, 'Authentication required');
    }

    const limited = await isRateLimited(`profile-update:${sessionUser._id}`, {
      limit: 10,
      windowSeconds: 600,
      failClosed: true,
    });
    if (limited) {
      return apiError(429, 'Too many profile updates. Please try again later.');
    }

    const body = await readJson(req);
    if (!isRecord(body)) {
      return apiError(400, 'Invalid request body');
    }

    const hasName = body.name !== undefined;
    const hasNewPassword = typeof body.newPassword === 'string' && body.newPassword.length > 0;

    if (!hasName && !hasNewPassword) {
      return apiError(400, 'Nothing to update');
    }

    await connectDB();
    const user = await User.findById(sessionUser._id).select('+password');
    if (!user) {
      return apiError(404, 'User not found');
    }

    if (hasName) {
      const name = validateName(body.name);
      if (!name) {
        return apiError(400, 'Name must be between 2 and 80 characters');
      }
      user.name = name;
    }

    if (hasNewPassword) {
      const passwordErrors = validatePassword(body.newPassword);
      if (passwordErrors.length > 0) {
        return apiError(400, passwordErrors.join('. '));
      }

      if (user.password) {
        const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return apiError(403, 'Incorrect current password');
        }
      }

      user.password = await bcrypt.hash(body.newPassword as string, 10);
      if (!user.provider) user.provider = 'credentials';
    }

    await user.save();

    return apiSuccess({ message: 'User updated successfully' });
  } catch (error) {
    logError('Error while updating user', error);
    return apiError(500, 'Unable to update profile');
  }
}
