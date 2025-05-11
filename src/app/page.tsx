import LogoutButton from "@/components/logout-button";
import OAuthLoginButton from "@/components/oauth-login-button";
import ProfileDisplay from "@/components/profile-display";

export default async function Home() {
  return (
    <main className="flex flex-col gap-10">
      <ProfileDisplay />
      <OAuthLoginButton />
      <OAuthLoginButton provider="github" />
      <OAuthLoginButton provider="google" />
      <OAuthLoginButton provider="kakao" />
      <OAuthLoginButton provider="naver" />
      <LogoutButton />
    </main>
  );
}
