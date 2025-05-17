"use client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

    const handleClick = async () => {
      const inputValue = inputRef.current?.value;
      if (inputValue) {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("profile")
          .insert({ user_id: (await supabase.auth.getUser()).data.user?.id, user_name: inputValue })
          .select();
        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Data inserted successfully:", data);
          revalidatePath("/", "layout");
          redirect("/");
        }
      }
    };

    return (
      <dialog ref={dialogRef}>
        <div>
          <h2>환영합니다!</h2>
          <p>회원가입을 축하드립니다.</p>
          <p>닉네임을 설정해주세요</p>
          <input ref={inputRef} type="text" placeholder="닉네임" />
          <button onClick={handleClick}>확인</button>
        </div>
      </dialog>
    );
  };

  return { WelcomeDialog, showModal, closeModal, isOpen };
}
