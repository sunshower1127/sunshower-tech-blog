"use client";

import { HTMLInputTypeAttribute, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function InputBox({
  className,
  placeholder,
  label,
  onChange,
  ...props
}: {
  className?: string;
  placeholder?: string;
  label?: string | React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
} & React.ComponentProps<"input">) {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEmpty(e.target.value === "");

    if (onChange) {
      onChange(e);
    }
  };

  // TODO: 외부에서 value값 넣으면 isEmpty가 업데이트되지않음 -> useImperativeHandle 써보면 될듯?

  return (
    <div className={twMerge("relative border rounded-md", className)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
      <input className="w-full h-full p-3" onChange={handleChange} {...props} />
      <div
        className={twMerge(
          "absolute transition-all",
          isEmpty
            ? "top-1/2 left-[1px] -translate-y-1/2 p-3 brightness-50 text-base -z-10 "
            : "left-2 text-xs p-1 -top-0 -translate-y-1/2 bg-zinc-900 z-10",
          isFocused ? "text-blue-200" : "text-white"
        )}
      >
        {isEmpty ? placeholder : label}
      </div>
    </div>
  );
}
