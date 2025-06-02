"use client";

import InputBox from "@/components/input-box";
import PrimaryButton from "@/components/primary-button";
import { debounce, delay } from "es-toolkit";
import { HelpCircleIcon, LoaderCircleIcon, UploadIcon, WandSparklesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { z } from "zod";
import TiptapEditor from "../tiptap/editor";

// 유효성 검증을 위한 스키마 정의
const postSchema = z.object({
  title: z.string().superRefine((value, ctx) => {
    const maxLength = 30;
    if (value.length > maxLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `제목은 30자 이내로 작성해주세요 (현재: ${value.length}자)`,
      });
    }
  }),
  enTitle: z.string().superRefine((value, ctx) => {
    const maxLength = 60;
    if (value.length > maxLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `영어 제목은 60자 이내로 작성해주세요 (현재: ${value.length}자)`,
      });
    }

    // 한글 문자가 포함되어 있는지 확인
    if (/[\u3131-\uD79D]/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "영어 제목에는 한글을 사용할 수 없습니다.",
      });
    }
  }),
});

export default function PostEditor({
  initialContent,
  onSubmit: handleSubmit,
  translateKR2EN,
  checkSlugExists,
}: {
  initialContent?: string;
  onSubmit: (post: { title: string; en_title: string; slug: string; html: string }) => void;
  translateKR2EN?: (enText: string) => Promise<string>;
  checkSlugExists?: (slug: string) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const [enTitle, setEnTitle] = useState("");
  const [enTitleError, setEnTitleError] = useState("");
  const enTitleInputRef = useRef<HTMLInputElement>(null);

  const [translateLoading, setTranslateLoading] = useState(false);
  const slug = slugify(enTitle, { lower: true, strict: true });

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "loaded" | "submitted">("idle");

  const editorRef = useRef<{ getContent: () => string | undefined }>(null);

  // 제목 유효성 검사
  const validateTitle = (value: string) => {
    try {
      postSchema.shape.title.parse(value);
      setTitleError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setTitleError(error.errors[0].message);
      }
    }
  };

  // 영어 제목 유효성 검사
  const validateEnTitle = (value: string) => {
    try {
      postSchema.shape.enTitle.parse(value);
      setEnTitleError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEnTitleError(error.errors[0].message);
      }
    }
  };

  // 슬러그 유효성 검사 (DB 중복 검사 포함)
  const validateSlug = async (value: string) => {
    try {
      // 슬러그 중복 검사
      if (checkSlugExists) {
        const exists = await checkSlugExists(value);
        if (exists) {
          setEnTitleError("이미 사용 중인 슬러그입니다. 다른 영어 제목을 입력해주세요.");
          return false;
        }
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEnTitleError(error.errors[0].message);
      }
      return false;
    }
  };

  const debouncedSetTitle = debounce((newTitle: string) => {
    validateTitle(newTitle);
    setTitle(newTitle);
  }, 1000);

  const debouncedSetEnTitle = debounce((newEnTitle: string) => {
    validateEnTitle(newEnTitle);
    const newSlug = slugify(newEnTitle);
    validateSlug(newSlug);
    setEnTitle(newEnTitle);
  }, 1000);

  const handleUpload = async () => {
    if (submitState !== "idle") {
      return;
    }
    setSubmitState("loading");
    await delay(1500); // validation 시간 확보
    setSubmitState("loaded");
  };

  useEffect(() => {
    if (submitState === "loaded") {
      // Validate form fields
      const html = editorRef.current?.getContent();

      const validationErrors = [
        { condition: titleError, message: titleError },
        { condition: title.trim() === "", message: "제목을 입력해주세요." },
        { condition: enTitleError, message: enTitleError },
        { condition: enTitle.trim() === "", message: "영어 제목을 입력해주세요." },
        { condition: !html || html === "<p></p>", message: "글 내용을 입력해주세요." },
      ];

      let hasError = false;

      // Check for validation errors
      for (const error of validationErrors) {
        if (error.condition) {
          toast.error(error.message);
          hasError = true;
        }
      }

      if (hasError) {
        setSubmitState("idle");
        return;
      }

      handleSubmit({
        title,
        en_title: enTitle,
        slug,
        html: html!,
      });
    }
  }, [submitState]);

  const handleTranslate = async () => {
    if (translateLoading) {
      return;
    }
    if (!translateKR2EN) {
      toast.error("번역 기능이 활성화되어 있지 않습니다.");
      return;
    }

    setTranslateLoading(true);

    try {
      const newEnTitle = await translateKR2EN(title);
      setEnTitle(newEnTitle);
      if (enTitleInputRef.current) {
        enTitleInputRef.current.value = newEnTitle;
      }
    } catch (error) {
      toast.error("번역 중 오류가 발생했습니다.");
      console.error("Translation error:", error);
    }

    setTranslateLoading(false);
  };

  console.log("translateLoading:", translateLoading);

  return (
    <div className="flex flex-col gap-5 p-1">
      <div className="flex flex-row items-center justify-between">
        <button className="w-min whitespace-nowrap hover:underline">임시저장(2)</button>
        <PrimaryButton className="flex gap-1" onClick={handleUpload}>
          <UploadIcon />
          업로드
        </PrimaryButton>
      </div>
      <div>
        <InputBox
          type="text"
          onChange={(event) => {
            debouncedSetTitle(event.target.value);
          }}
          placeholder="제목을 입력하세요 (최대 20자)"
          label="제목"
        />
        <div className="text-red-400 h-1 m-3">{titleError}</div>
      </div>

      <div>
        <div className="flex flex-row gap-1 items-center">
          <InputBox
            className="w-full"
            type="text"
            onChange={(event) => {
              debouncedSetEnTitle(event.target.value);
            }}
            placeholder="영어 제목을 입력하세요 (최대 40자, 한글 사용 불가)"
            label={
              <div className="relative flex flex-row items-center gap-0.5 group">
                영어 제목
                <HelpCircleIcon className="size-4 cursor-pointer" />
                <div className="hidden group-hover:block bg-white z-20 absolute left-full top-1/2 -translate-y-1/2 text-xs text-zinc-500 text-nowrap p-2 ml-4 rounded-md">
                  <b>URL주소</b> 생성에 사용됩니다. <br />
                  <i className="underline">https://sunshower-tech-blog.vercel.app/posts/{slug}</i>
                </div>
              </div>
            }
            ref={enTitleInputRef}
            disabled={translateLoading}
          />
          <PrimaryButton className="text-nowrap" onClick={handleTranslate} disabled={translateLoading || !title}>
            {translateLoading ? <LoaderCircleIcon className="animate-spin" /> : <WandSparklesIcon />}
          </PrimaryButton>
        </div>
        <div className="text-red-400 h-1 m-3">{enTitleError}</div>
      </div>

      <TiptapEditor initialContent={initialContent} ref={editorRef} />
    </div>
  );
}
