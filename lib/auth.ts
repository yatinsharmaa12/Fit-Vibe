import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/utils/db';
import { User, IUser } from '@/models/user';

const providers: NextAuthOptions['providers'] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid email or password');
      }

      await connectDB();
      const email = credentials.email.trim().toLowerCase();
      const user = await User.findOne({ email }).select('+password').lean<IUser | null>();

      if (!user?.password) {
        throw new Error('Invalid email or password');
      }

      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        points: user.points,
      };
    },
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true;
      }

      if (!user.email) {
        return false;
      }

      try {
        await connectDB();
        await User.updateOne(
          { email: user.email.toLowerCase() },
          {
            $setOnInsert: {
              name: user.name,
              email: user.email.toLowerCase(),
              provider: 'google',
              image: user.image,
              points: 0,
              token: 0,
              calories: 0,
              challenges: [],
              customPoses: [],
            },
          },
          { upsert: true }
        );
        return true;
      } catch (error) {
        console.error('Google sign-in failed:', error instanceof Error ? error.message : error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      const email = (token.email || user?.email)?.toLowerCase();

      if (account?.provider === 'google' || (!token.id && email)) {
        await connectDB();
        const dbUser = await User.findOne({ email }).select('_id points').lean();
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.points = dbUser.points;
        }
      } else if (user) {
        token.id = user.id;
        token.points = (user as { points?: number }).points ?? 0;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? '';
        session.user.points = token.points ?? 0;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSessionUser(): Promise<IUser | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;

  await connectDB();
  return User.findOne({ email: email.toLowerCase() });
}
