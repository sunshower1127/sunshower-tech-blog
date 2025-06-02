import React from "react";
import { twMerge } from "tailwind-merge";

export default function PrimaryButton({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={twMerge("p-2 rounded-md bg-blue-500 text-white hover:brightness-75 disabled:brightness-75 not-disabled:cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}
