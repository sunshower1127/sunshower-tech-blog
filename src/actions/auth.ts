"use server";

import { signIn, signOut } from "@/auth/index";

export async function oauthLoginAction(provider?: "github" | "google" | "kakao" | "naver") {
  await signIn(provider);
}

export async function oauthLogoutAction() {
  await signOut();
}
