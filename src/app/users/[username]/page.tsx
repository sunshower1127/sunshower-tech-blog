import { Props } from "@/types/next";

// TODO: 사용자 프로필 페이지 구현
// 자기 자신의 페이지일 경우 수정 가능하게
export default async function UserProfilePage({ params }: Props) {
  const username = (await params).username;
  return <div>username = {username}</div>;
}
