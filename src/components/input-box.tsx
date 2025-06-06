"use client";

import { debounce } from "es-toolkit";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function useDebouncedInput(delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setValueRef = useRef<Dispatch<SetStateAction<string>>>(() => {});

  const setValue = (newValue: string) => {
    setValueRef.current(newValue);
    setDebouncedValue(newValue);
    setIsDebouncing(false);
  };

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
    setIsDebouncing(false);
  }, delay);

  const InputBox = useCallback(
    ({
      className,
      label,
      placeholder,
      ...props
    }: {
      className?: string;
      label: string | React.ReactNode;
      placeholder: string | React.ReactNode;
    } & React.ComponentProps<"input">) => {
      const [value, setValue] = useState("");
      setValueRef.current = setValue; // Store the setter function for external use

      const [isFocused, setIsFocused] = useState(false);

      return (
        <div className={twMerge("relative border rounded-md", className)}>
          <input
            className="w-full h-full p-3"
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setIsDebouncing(true);
              handleChange(e);
              setValue(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <div
            className={twMerge(
              "absolute transition-all",
              !value
                ? "top-1/2 left-[1px] -translate-y-1/2 p-3 brightness-50 text-base -z-10 "
                : "left-2 text-xs p-1 -top-0 -translate-y-1/2 bg-zinc-900 z-10",
              isFocused ? "text-blue-200" : "text-white"
            )}
          >
            {!value ? placeholder : label}
          </div>
        </div>
      );
    },
    []
  );

  return [InputBox, debouncedValue, setValue, isDebouncing] as const;
}
