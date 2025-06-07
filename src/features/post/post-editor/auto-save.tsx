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

type AutoSaveKeyTuple = [createdAt: number, title: string, sessionId: string];
const CREATED_AT = 0,
  TITLE = 1,
  SESSION_ID = 2;

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
  const [saves, setSaves] = useState<AutoSaveKeyTuple[]>([]);
  const [open, setOpen] = useState(false);
  const isThrottlingRef = useRef(false);

  // Store 인스턴스를 메모이제이션
  const store = useMemo(() => idb.createStore("autosave", "posts"), []);

  // 고유 ID를 메모이제이션
  const sessionId = useMemo(() => nanoid(8), []);

  // 기존 autosave 목록 로드
  const loadExistingSaves = useCallback(async () => {
    try {
      const keys = (await idb.keys(store)) as AutoSaveKeyTuple[];
      // IndexedDB는 키의 첫 번째 요소 (createdAt) 기준으로 오름차순 정렬합니다.
      // UI 표시는 최신순이므로 reverse() 또는 sort()로 내림차순 정렬합니다.
      setSaves(keys);
    } catch (error) {
      console.error("Failed to load existing autosaves:", error);
    }
  }, [store]);

  const clearUnvalidSaves = useCallback(async () => {
    try {
      const allKeys = (await idb.keys(store)) as AutoSaveKeyTuple[];
      const now = Date.now();
      const expiredKeys: AutoSaveKeyTuple[] = [];
      const validKeysSorted: AutoSaveKeyTuple[] = []; // createdAt 오름차순

      // allKeys는 createdAt 오름차순으로 정렬되어 있음
      for (const key of allKeys) {
        if (now - key[CREATED_AT] >= EXPIRATION_TIME) {
          expiredKeys.push(key);
        } else {
          validKeysSorted.push(key);
        }
      }

      if (expiredKeys.length > 0) {
        await idb.delMany(expiredKeys, store);
        console.log("Expired autosaves cleaned up:", expiredKeys.length);
      }

      let excessKeysRemoved = false;
      if (validKeysSorted.length > MAX_AUTOSAVES) {
        // validKeysSorted는 createdAt 오름차순이므로, 앞에서부터 초과분을 삭제
        const keysToDelete = validKeysSorted.slice(0, validKeysSorted.length - MAX_AUTOSAVES);
        if (keysToDelete.length > 0) {
          await idb.delMany(keysToDelete, store);
          console.log("Excess autosaves removed:", keysToDelete.length);
          excessKeysRemoved = true;
        }
      }
    } catch (error) {
      console.error("Failed to clean up autosaves:", error);
    }
  }, [store]);

  const autoSave = useCallback(
    throttle(async ({ title, en_title, tags }: Post) => {
      try {
        if (!editor || !editor.getText().trim()) return;

        const createdAt = Date.now();
        // 키: [createdAt, title, sessionId]
        const currentKey: AutoSaveKeyTuple = [createdAt, title, sessionId];
        const value: AutoSaveValue = {
          en_title,
          tags,
          content: editor.getHTML(),
        };

        const oldKey = ((await idb.keys(store)) as AutoSaveKeyTuple[]).find((key) => key[SESSION_ID] === sessionId);

        if (oldKey) {
          await idb.del(oldKey, store); // 이전 세션의 임시 저장 삭제
        }
        await idb.set(currentKey, value, store);
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
      if (isMounted) {
        await delay(10 * SECOND); // 페이지 로드 속도 개선 -> delay 줘서 로드후 실행되게
        clearUnvalidSaves();
      }
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
    async (saveKey: AutoSaveKeyTuple) => {
      try {
        const value = (await idb.get(saveKey, store)) as AutoSaveValue | undefined;

        if (!value) {
          throw new Error("No autosave found for this key");
        }

        setTitle(saveKey[TITLE]);
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
            saves.map((saveKey) => (
              <div
                key={saveKey[SESSION_ID]}
                className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => loadSave(saveKey)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[200px]">{saveKey[TITLE] || "(제목 없음)"}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(saveKey[CREATED_AT]).toLocaleString(undefined, {
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
