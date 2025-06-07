import { MINUTE, MONTH, SECOND } from "@/utils/time";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Editor } from "@tiptap/react";
import { delay, throttle } from "es-toolkit";
import * as idb from "idb-keyval";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Post } from "..";

const MAX_AUTOSAVES = 20; // Maximum number of autosaves to keep
const EXPIRATION_TIME = 1 * MONTH;
const AUTOSAVE_INTERVAL = 10 * SECOND;
const CLEAR_UNVALID_SAVES_INTERVAL = 1 * MINUTE;
interface AutoSaveKey {
  id: string;
  title: string;
  createdAt: number;
}

interface AutoSaveValue {
  en_title: string;
  tags: string[];
  content: string;
}

export default function AutoSave({
  editor,
  postHeader,
  setTitle,
  setEnTitle,
  setTags,
}: {
  editor: Editor | null;
  postHeader: Post;
  setTitle: (title: string) => void;
  setEnTitle: (en_title: string) => void;
  setTags: (tags: Set<string>) => void;
}) {
  const [saves, setSaves] = useState<{ id: string; title: string; createdAt: number }[]>([]);
  const [open, setOpen] = useState(false);
  const isThrottlingRef = useRef(false);

  // Store 인스턴스를 메모이제이션
  const store = useMemo(() => idb.createStore("autosave", "posts"), []);

  // 고유 ID를 메모이제이션
  const sessionId = useMemo(() => nanoid(8), []);

  // 기존 autosave 목록 로드
  const loadExistingSaves = useCallback(async () => {
    try {
      const keys = await idb.keys(store);
      const sortedSaveKeys = keys.map((key) => JSON.parse(key as string) as AutoSaveKey).sort((a, b) => b.createdAt - a.createdAt);

      setSaves(sortedSaveKeys);
    } catch (error) {
      console.error("Failed to load existing autosaves:", error);
    }
  }, [store]);
  const clearUnvalidSaves = useCallback(async () => {
    try {
      const allKeysRaw = await idb.keys(store);
      const now = Date.now();
      const allParsedKeys: AutoSaveKey[] = [];
      const expiredKeysRaw: string[] = [];

      for (const keyRaw of allKeysRaw) {
        const parsedKey = JSON.parse(keyRaw as string) as AutoSaveKey;
        allParsedKeys.push(parsedKey);
        if (now - parsedKey.createdAt >= EXPIRATION_TIME) {
          expiredKeysRaw.push(keyRaw as string);
        }
      }

      if (expiredKeysRaw.length > 0) {
        await idb.delMany(expiredKeysRaw, store);
        console.log("Expired autosaves cleaned up:", expiredKeysRaw.length);
      }

      // 만료된 키를 제외한 나머지 키들로 초과분 계산
      const remainingKeysAfterExpiration = allParsedKeys.filter((pk) => !expiredKeysRaw.includes(JSON.stringify(pk)));

      if (remainingKeysAfterExpiration.length > MAX_AUTOSAVES) {
        const sortedKeysToConsider = remainingKeysAfterExpiration.sort((a, b) => a.createdAt - b.createdAt);
        const keysToDelete = sortedKeysToConsider.slice(0, sortedKeysToConsider.length - MAX_AUTOSAVES).map((key) => JSON.stringify(key));

        if (keysToDelete.length > 0) {
          await idb.delMany(keysToDelete, store);
          console.log("Excess autosaves removed:", keysToDelete.length);
        }
      }
      // 정리 후 목록을 다시 로드하여 UI에 반영
      loadExistingSaves();
    } catch (error) {
      console.error("Failed to clean up autosaves:", error);
    }
  }, [store, loadExistingSaves]); // loadExistingSaves를 의존성 배열에 추가

  const autoSave = useCallback(
    throttle(async ({ title, en_title, tags }: Post) => {
      try {
        if (!editor || !editor.getText().trim()) return;

        const keys = await idb.keys(store);
        const parsedKeys = keys.map((key) => JSON.parse(key as string) as AutoSaveKey);

        const i = parsedKeys.findIndex((key) => key.id === sessionId);

        const value: AutoSaveValue = {
          en_title,
          tags,
          content: editor.getHTML(),
        };

        if (i !== -1) {
          // 이미 존재하는 세션이면 업데이트
          await idb.set(keys[i], value, store);
        } else {
          const createdAt = Date.now();
          const newKey: AutoSaveKey = { id: sessionId, title, createdAt };
          await idb.set(JSON.stringify(newKey), value, store);
        }
      } catch (error) {
        console.error("Autosave failed:", error);
        toast.error("자동 저장에 실패했습니다.");
      } finally {
        isThrottlingRef.current = false;
      }
    }, AUTOSAVE_INTERVAL),
    [editor, store, sessionId]
  );

  useEffect(() => {
    let isMounted = true;
    const intervalId = setInterval(async () => {
      await delay(10 * SECOND);
      if (isMounted) clearUnvalidSaves();
    }, CLEAR_UNVALID_SAVES_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [clearUnvalidSaves]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      isThrottlingRef.current = true;
      autoSave(postHeader);
    };
    // postHeader가 변경되면 autosave
    handleUpdate();

    // editor의 content가 변경되면 autosave
    editor.on("update", handleUpdate);

    const flushAutosave = (e: BeforeUnloadEvent) => {
      if (isThrottlingRef.current) {
        // flush가 비동기라서 일단 페이지 나가는걸 한 번 막아서 시간 끌기
        autoSave.flush();
        e.preventDefault();
        toast.warning("임시저장중입니다. 다시 시도해주세요.");
        return "";
      }
    };
    window.addEventListener("beforeunload", flushAutosave);

    return () => {
      editor.off("update", handleUpdate);
      window.removeEventListener("beforeunload", flushAutosave);
    };
  }, [editor, autoSave, postHeader.title, postHeader.en_title, [...postHeader.tags]]);
  const loadSave = useCallback(
    async (save: AutoSaveKey) => {
      try {
        const key = JSON.stringify(save);
        const value = (await idb.get(key, store)) as AutoSaveValue | undefined;

        if (!value) {
          throw new Error("No autosave found for this key");
        }

        setTitle(save.title);
        setEnTitle(value.en_title);
        setTags(new Set(value.tags));
        editor?.commands.setContent(value.content);
        toast.success("임시저장된 내용을 불러왔습니다.");
      } catch (error) {
        console.error("Failed to load autosave:", error);
        toast.error("임시저장 불러오기에 실패했습니다.");
      } finally {
        setOpen(false);
      }
    },
    [editor, setTitle, setEnTitle, setTags, store]
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-min whitespace-nowrap hover:underline" onClick={loadExistingSaves}>
          임시저장목록
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <div className="max-h-[400px] overflow-y-auto">
          {saves.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">임시저장된 내용이 없습니다.</div>
          ) : (
            saves.map((save) => (
              <div
                key={save.id}
                className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => loadSave(save)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[200px]">{save.title || "제목 없음"}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(save.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
