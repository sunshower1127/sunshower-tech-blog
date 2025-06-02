"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "../supabase/client";

export function useWelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  const WelcomeDialog = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleClick = async () => {
      const inputValue = inputRef.current?.value;
      if (inputValue) {
        const supabase = createClient();

        const userId = (await supabase.auth.getUser()).data.user?.id;

        console.log("userId", userId);
        console.log("inputValue", inputValue);

        const { error } = await supabase.from("profiles").insert({ user_id: userId, user_name: inputValue });
        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Data inserted successfully:");
          router.refresh();
        }
      }
    };

    return (
      <dialog className="m-auto backdrop-opacity-50" ref={dialogRef}>
        <div className="flex flex-col items-center gap-2 p-10 shadow-2xl">
          <h2 className="text-5xl">환영합니다!</h2>
          <p>회원가입을 축하드립니다.</p>
          <br />
          <p>닉네임을 설정해주세요</p>
          <input ref={inputRef} type="text" placeholder="닉네임" />
          <button className="bg-blue-500 p-1 w-12 rounded-md " onClick={handleClick}>
            확인
          </button>
        </div>
      </dialog>
    );
  };

  return { WelcomeDialog, showModal, closeModal, isOpen };
}
