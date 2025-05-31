import { Editor } from "@tiptap/react";
import { del, get, keys, set } from "idb-keyval";

const AUTO_SAVE_EXPIRY = 24 * 60 * 60 * 1000; // 24시간

interface AutoSaveData {
  content: string;
  lastSaved: number;
}

export const generateAutoSaveKey = (slug: string) => `autosave_${slug}`;

export const saveEditorContent = async (slug: string, editor: Editor) => {
  console.log("save editor content");
  const key = generateAutoSaveKey(slug);
  const data: AutoSaveData = {
    content: editor.getHTML(),
    lastSaved: Date.now(),
  };
  await set(key, data);
};

export const loadEditorContent = async (slug: string): Promise<string | null> => {
  const key = generateAutoSaveKey(slug);
  const data = await get<AutoSaveData>(key);

  if (!data) return null;

  // 만료된 데이터인지 확인
  if (Date.now() - data.lastSaved > AUTO_SAVE_EXPIRY) {
    await del(key);
    return null;
  }

  return data.content;
};

export const clearAutoSave = async (slug: string) => {
  const key = generateAutoSaveKey(slug);
  await del(key);
};

export const cleanupExpiredAutoSaves = async () => {
  try {
    // 모든 키 가져오기
    const allKeys = await keys();
    const now = Date.now();
    let cleanedCount = 0;

    // 각 키에 대해 만료 여부 확인
    for (const key of allKeys) {
      if (typeof key === "string" && key.startsWith("autosave_")) {
        const data = await get<AutoSaveData>(key);
        if (data && now - data.lastSaved > AUTO_SAVE_EXPIRY) {
          await del(key);
          cleanedCount++;
          console.log(`만료된 자동 저장 데이터 삭제: ${key}`);
        }
      }
    }

    console.log(`총 ${cleanedCount}개의 만료된 자동 저장 데이터가 삭제되었습니다.`);
    return cleanedCount;
  } catch (error) {
    console.error("만료된 자동 저장 데이터 정리 중 오류 발생:", error);
    throw error;
  }
};
