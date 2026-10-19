import { NextRequest, NextResponse } from 'next/server';
import { logWarn } from '@/lib/logger';

export function apiError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ success: false, error, ...extra }, { status });
}

export function apiSuccess(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export async function readJson<T = unknown>(request: NextRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch (error) {
    logWarn('Invalid JSON body', { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
