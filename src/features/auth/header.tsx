import Link from "next/link";
import { createClient } from "../supabase/server";
import { logout } from "./actions";
import WelcomeDialogWrapper from "./welcome-dialog-wrapper";

export default async function AuthHeader() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // 로그아웃 상태일때
  if (error) {
    return (
      <header>
        <div>
          <Link href="/login">로그인</Link>
        </div>
      </header>
    );
  }

  // 사용자 프로필 정보 조회
  const { data: selectResult, error: profileError } = await supabase.from("profile").select("user_name").eq("user_id", data.user.id);

  if (profileError) {
    console.error("Error fetching data:", profileError);
    return (
      <header>
        <div>
          <p>프로필 정보를 불러오는 중 오류가 발생했습니다</p>
          <form action={logout}>
            <button type="submit">로그아웃</button>
          </form>
        </div>
      </header>
    );
  }

  const username = selectResult?.[0]?.user_name;

  if (username) {
    // 기존 사용자인 경우
    return (
      <header>
        <div>
          <p>{username}</p>
          <form action={logout}>
            <button type="submit">로그아웃</button>
          </form>
        </div>
      </header>
    );
  } else {
    // 새 사용자인 경우 (닉네임이 없는 경우)
    return <WelcomeDialogWrapper />;
  }
}
