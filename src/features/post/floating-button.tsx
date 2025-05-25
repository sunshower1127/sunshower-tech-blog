import Link from "next/link";
import { createClient } from "../supabase/server";

export default async function PostFlatingButton() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getUser();
  if (error) {
    return null; // 사용자 인증이 실패한 경우 버튼을 렌더링하지 않음
  }
  return (
    <Link className="fixed bottom-0 right-0 bg-blue-500 py-2 px-5 rounded-full m-1 hover:brightness-75" href="/protected/editor">
      + New
    </Link>
  );
}
