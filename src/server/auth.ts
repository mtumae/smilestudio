import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { env } from "~/env"
import bcryptjs from "bcryptjs"

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
      adapter: DrizzleAdapter(db),

  providers: [
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
})