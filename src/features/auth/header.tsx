import Link from "next/link";
import { createClient } from "../supabase/server";

export default async function AuthHeader() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  // 로그아웃 상태일때
  if (error) {
    return (
      <div>
        <Link href="/login">로그인</Link>
      </div>
    );
  } else {
    // 대충 이제 username을 profile에서 못찾을 경우 새 회원이니깐 팝업띄우든 뭐하든 profile에 등록시키기
    return <div></div>;
  }
}
