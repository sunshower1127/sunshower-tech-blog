import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function PrimaryButton({ className, children, loading, ...props }: { loading?: boolean } & React.ComponentProps<"button">) {
  return (
    <button
      className={twMerge("p-2 rounded-md bg-blue-500 text-white hover:brightness-75 disabled:brightness-75 not-disabled:cursor-pointer", className)}
      disabled={loading}
      {...props}
    >
      {loading ? <LoaderCircleIcon className="animate-spin" /> : children}
    </button>
  );
}
