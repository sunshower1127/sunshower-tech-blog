"use client";

import { useEffect } from "react";
import { useWelcomeDialog } from "./use-welcome-dialog";

export default function WelcomeDialogWrapper() {
  const { WelcomeDialog, showModal } = useWelcomeDialog();

  useEffect(() => {
    // 컴포넌트가 마운트된 후 모달 표시
    showModal();
  }, [showModal]);

  return (
    <header>
      <WelcomeDialog />
    </header>
  );
}
