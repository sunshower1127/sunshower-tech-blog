"use client";

import { setUserName } from "@/actions/auth";
import { getRandomUsername } from "@/db/random-username";
import { useSession } from "next-auth/react";

import { useEffect } from "react";

export default function SignUpDialog() {
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.username === null) {
      const username = prompt("닉네임을 설정해주세요", getRandomUsername());
      setUserName(session.data!.user!.id!, username!).then(() => {
        alert("닉네임이 설정되었습니다.");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  return null;
}

/*
왜 useSession은 authorization이 2번 발동하는가? 흠...
로그아웃할때도 그렇고... 
두번 작동하는걸 어떻게 막지 -> 뭐 useEffect로 막아야죠...

아니 client 컴포넌트에서 서버액션을 이렇게 직접적으로 부를 수가 있네요
너무 신기함
이게 최신기술이지
뭐 api에서 따로 안만들어도
서버액션 함수만 정의하면 클라이언트 컴포넌트에서 쓸 수 있음.

next auth는 사실상 쓰레기입니다
많은걸 바라면 안되고
그냥 간단하게만 쓰면 됨.
*/
