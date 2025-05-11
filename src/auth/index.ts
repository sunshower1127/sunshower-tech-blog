import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";

import NextAuth, { DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google, Kakao, Naver],
  adapter: DrizzleAdapter(db),
  session: { strategy: "database" },

  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

      if (dbUser && dbUser.length > 0) {
        // 세션에 닉네임 추가
        session.user.username = dbUser[0].username;
      }
      return session;
    },

    //     // db에 저장되기 전에 signIn이 호출됨 -> 쓸모가 없는거 같은데?
    //     // 막 db에서 생성된 user는 못가져옴 얘가
    //     async signIn({ user }) {
    //       console.log("1", user.id);

    //       let dbUser = [];
    //       let cnt = 0;
    //       while (isEmpty(dbUser)) {
    //         cnt += 1;
    //         dbUser = await db.select().from(users).where(eq(users.id, user.id!)).limit(1);
    //       }
    //       console.log("2", cnt, dbUser);

    //       await db.update(users).set({ username: getRandomUsername() }).where(eq(users.id, user.id!)).execute();

    //       console.log("3");
    //       return true;
    //     },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      username: string | null;
    } & DefaultSession["user"];
  }
}
