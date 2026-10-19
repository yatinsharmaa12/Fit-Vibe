export const DB_NAME = process.env.MONGODB_DB || 'fitvibe';

export function getAppUrl(): string {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  user: string;
  pass: string;
};

export function getEmailConfig(): EmailConfig | null {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !Number.isInteger(port) || port <= 0 || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    user,
    pass,
  };
}

export function getMongoUri(): string {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }
  return process.env.MONGO_URI;
}
