// lib/auth.ts

import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign_in",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Thiếu email hoặc mật khẩu");

        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error("Email hoặc mật khẩu không đúng");
        if (!(await compare(credentials.password, user.password))) throw new Error("Email hoặc mật khẩu không đúng");

        return {
          id: user.id.toString(),
          name: user.name ?? undefined, 
          email: user.email,
          image: user.avatar ?? undefined, 
        };

      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture, 
        };
      },
    }),

  ],

  callbacks: {
    
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role as any;
        session.user.name = user.name;
        session.user.image = user.avatar;
        session.user.numberphone = user.numberphone;
        session.user.address = user.address;
        session.user.delivery = user.delivery;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
