import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google, Kakao, Naver],
  adapter: DrizzleAdapter(db),
  session: { strategy: "database" },
  debug: true,
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

      if (dbUser && dbUser.length > 0) {
        // 세션에 닉네임 추가
        session.user.username = dbUser[0].username;
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string | null;
      email: string;
      emailVerified: string | null;
      image: string;
    };
  }
}
