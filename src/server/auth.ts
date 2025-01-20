import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "~/server/db"
import { users,accounts, sessions, verificationTokens } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { env } from "~/env"
import bcryptjs from "bcryptjs"
import Google from "next-auth/providers/google"
import { Adapter } from "next-auth/adapters"

export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user.id = token.id as string;
          }
          return session;
        },
        async redirect({ url, baseUrl }) {
          if (url.startsWith('/')) {
            return `${baseUrl}${url}`;
          }
          if (url.startsWith(baseUrl)) {
            return `${baseUrl}`;
          }
          
          return url;
        },
      },
      adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      }) as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            'email',
            'profile',
            // 'https://www.googleapis.com/auth/calendar',
            // 'https://www.googleapis.com/auth/calendar.events',
          ].join(' '),
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "username@gmail.com" },
        phone: { label: "Phone", type: "phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
    
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const userEmail = credentials.email as string;
        
        const user = await db.select()
          .from(users)
          .where(eq(users.email, userEmail))
          .then(res => res[0]);

        if (!user?.password) {
          return null;
        }

        
     const isValid = await bcryptjs.compare(credentials.password as string, user.password);
        if(!isValid){
            return null;
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: env.AUTH_SECRET,
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "auth/signin",
  },
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
})
