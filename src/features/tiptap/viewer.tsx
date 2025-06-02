"use client";

import { EditorContent } from "@tiptap/react";
import useTiptapEditor from "./use-tiptap-editor";

export default function TitapViewer({ initialContent }: { initialContent?: string }) {
  const editor = useTiptapEditor({ editable: false, initialContent });
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
