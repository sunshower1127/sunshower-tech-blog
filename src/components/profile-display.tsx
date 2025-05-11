/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";

export default function ProfileDisplay() {
  const { data: session, status } = useSession();
  const profileImage = session?.user.image || null;
  const profileName = session?.user.name || null;

  console.log("status", status);
  console.log("profileName", profileName);
  return (
    <div className="flex flex-row items-center gap-1">
      <img className="w-6 aspect-square rounded-full" src={profileImage!} alt="profile image" />
      <div>{profileName}</div>
    </div>
  );
}
