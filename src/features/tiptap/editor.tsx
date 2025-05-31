"use client";

import { Editor, EditorContent } from "@tiptap/react";
import { debounce } from "es-toolkit";
import { useEffect, useState } from "react";
import { cleanupExpiredAutoSaves, loadEditorContent, saveEditorContent } from "./auto-save";
import useTiptapEditor from "./use-tiptap-editor";

interface TiptapEditorProps {
  slug: string;
}

const AUTO_SAVE_INTERVAL = 5000; // 5초
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1시간

export default function TiptapEditor({ slug }: TiptapEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [initialContent, setInitialContent] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const content = await loadEditorContent(slug);
      setInitialContent(content);
      setIsLoading(false);
    };
    loadContent();
  }, [slug]);

  const savePost = debounce(async (editor: Editor) => {
    await saveEditorContent(slug, editor);
  }, 1000);

  const editor = useTiptapEditor({
    initialContent,
    editable: true,
  });

  useEffect(() => {
    if (!editor) return;

    // 주기적인 자동 저장
    const autoSaveInterval = setInterval(() => {
      savePost(editor);
    }, AUTO_SAVE_INTERVAL);

    // 에디터 변경 시 저장
    editor.on("update", () => {
      savePost(editor);
    });

    // 주기적인 만료 데이터 정리
    const cleanupInterval = setInterval(async () => {
      try {
        await cleanupExpiredAutoSaves();
      } catch (error) {
        console.error("자동 저장 데이터 정리 중 오류 발생:", error);
      }
    }, CLEANUP_INTERVAL);

    return () => {
      clearInterval(autoSaveInterval);
      clearInterval(cleanupInterval);
    };
  }, [editor, slug]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
