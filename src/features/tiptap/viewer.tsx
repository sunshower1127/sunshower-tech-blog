"use client";

import { EditorContent } from "@tiptap/react";
import { once } from "es-toolkit";
import useTiptapEditor from "./use-tiptap-editor";

const getPost = once(() => (typeof window !== "undefined" ? localStorage.getItem("post") : null));

export default function TitapViewer() {
  const editor = useTiptapEditor({ editable: false, initialContent: getPost() });
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
