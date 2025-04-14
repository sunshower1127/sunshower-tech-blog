"use client";

import { oauthLoginAction } from "@/actions/auth";

export default function OAuthLoginButton({ provider }: { provider?: "github" | "google" | "kakao" | "naver" }) {
  return (
    <button className="bg-zinc-800 text-white w-60" onClick={() => oauthLoginAction(provider)}>
      Sign In With {provider?.toUpperCase() || "NEXT AUTH"}
    </button>
  );
}
