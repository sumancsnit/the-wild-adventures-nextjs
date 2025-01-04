import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { createGuest, getGuest } from './data-service';

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      return !!auth?.user;
    },
    signIn: async ({ user, account, profile }) => {
      try {
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) {
          await createGuest({
            email: user.email,
            fullName: user.name,
          });
        }
        return true;
      } catch (_error) {
        return false;
      }
    },
    session: async ({ session, user }) => {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest?.id;
      return;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
