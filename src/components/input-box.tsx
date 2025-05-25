"use client";

import { HTMLInputTypeAttribute } from "react";

export default function InputBox({
  className,
  placeholder,
  label,
  onChange,
  type = "text",
}: {
  className?: string;
  placeholder?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
}) {
  // TODO: 구글 스타일 따라하기
  return (
    <div className={"relative " + className}>
      <input className="w-full h-full p-1 border" type={type} />
      <div></div>
    </div>
  );
}
