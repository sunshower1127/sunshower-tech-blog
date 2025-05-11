"use server";

import { signIn, signOut } from "@/auth/index";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function oauthLoginAction(provider?: "github" | "google" | "kakao" | "naver") {
  await signIn(provider);
}

export async function oauthLogoutAction() {
  await signOut();
}

export async function setUserName(userId: string, username: string) {
  await db.update(users).set({ username }).where(eq(users.id, userId)).execute();
}
