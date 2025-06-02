"use client";

import { EditorContent } from "@tiptap/react";
import { useImperativeHandle } from "react";
import useTiptapEditor from "./use-tiptap-editor";

const AUTO_SAVE_INTERVAL = 5000; // 5초
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1시간

export default function TiptapEditor({
  initialContent,
  ref,
}: {
  initialContent?: string;
  ref?: React.ForwardedRef<{ getContent: () => string | undefined }>;
}) {
  const editor = useTiptapEditor({
    initialContent,
    editable: true,
  });

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => editor?.getHTML(),
    }),
    [editor]
  );

  return (
    <div className="py-6 bg-zinc-800 rounded-md">
      <EditorContent editor={editor} />
    </div>
  );
}
