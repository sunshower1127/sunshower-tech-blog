"use client";

import { oauthLogoutAction } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <button className="bg-zinc-800 text-white w-60" onClick={oauthLogoutAction}>
      로그아웃
    </button>
  );
}
