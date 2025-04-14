import { auth } from "@/auth/index";
import LogoutButton from "@/components/logout-button";
import OAuthLoginButton from "@/components/oauth-login-button";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex flex-col gap-10">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <OAuthLoginButton />
      <OAuthLoginButton provider="github" />
      <OAuthLoginButton provider="google" />
      <OAuthLoginButton provider="kakao" />
      <OAuthLoginButton provider="naver" />
      <LogoutButton />
    </main>
  );
}
