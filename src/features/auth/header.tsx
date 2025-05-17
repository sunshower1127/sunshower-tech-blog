import Link from "next/link";
import { createClient } from "../supabase/server";
import { logout } from "./actions";
import { useWelcomeDialog } from "./use-welcome-dialog";

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
  } else {
    // 대충 이제 username을 profile에서 못찾을 경우 새 회원이니깐 팝업띄우든 뭐하든 profile에 등록시키기
    const { data: selectResult, error } = await supabase.from("profile").select("user_name").eq("user_id", data.user.id);
    const username = selectResult?.[0]?.user_name;
    if (error) {
      console.error("Error fetching data:", error);
    } else if (username) {
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
      // 회원가입을 축하합니다. 닉네임을 설정해주세요
      const { WelcomeDialog, showModal } = useWelcomeDialog();
      showModal();
      return <WelcomeDialog />;
    }
  }
}
