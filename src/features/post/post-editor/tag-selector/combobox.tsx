"use client";

import * as React from "react";

import PrimaryButton from "@/components/primary-button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "react-toastify";

export function Combobox({ tagList, tags, addTag }: { tagList: string[]; tags: Set<string>; addTag: (tag: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PrimaryButton className="">+ Tag</PrimaryButton>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput ref={inputRef} placeholder="Tag 목록 검색..." />
            <CommandList>
              <CommandEmpty
                onClick={() => {
                  const newTag = inputRef.current?.value.trim();
                  if (!newTag) {
                    toast.error("태그를 입력해주세요.");
                    return;
                  }
                  addTag(newTag);
                  setOpen(false);
                }}
              >
                + Tag 추가하기
              </CommandEmpty>
              <CommandGroup>
                {[...new Set(tagList).difference(tags)].map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={(value: string) => {
                      addTag(value);
                      setOpen(false);
                    }}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
