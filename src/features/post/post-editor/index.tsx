"use client";

import useDebouncedInput from "@/components/input-box";
import PrimaryButton from "@/components/primary-button";
import useTiptapEditor from "@/features/tiptap/use-tiptap-editor";
import { EditorContent } from "@tiptap/react";
import { enableMapSet, produce } from "immer";
import { HelpCircleIcon, LoaderCircleIcon, Redo2Icon, UploadIcon, WandSparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Post } from "..";
import AutoSave from "./auto-save";
import TagSelector from "./tag-selector";
import useValidation from "./use-validation";

enableMapSet(); // Immer에서 Set을 사용하기 위해 enableMapSet을 호출합니다.

export default function PostEditor({
  post,
  onSubmit: handleSubmit,
  translateKR2EN,
  checkSlugExists,
  getTagList,
}: {
  post?: Post;
  onSubmit: (post: { id?: number; title: string; en_title: string; slug: string; html: string; tags: string[] }) => void;
  translateKR2EN: (enText: string) => Promise<string>;
  checkSlugExists: (slug: string) => Promise<boolean>;
  getTagList: () => Promise<string[]>;
}) {
  const [TitleInput, title, setTitle, isTitleDebouncing] = useDebouncedInput();
  const [titleError, setTitleError] = useState("");

  const [EnTitleInput, enTitle, setEnTitle, isEnTitleDebouncing] = useDebouncedInput();
  const [enTitleError, setEnTitleError] = useState("");

  const [tagList, setTagList] = useState<string[]>([]);
  useEffect(() => {
    getTagList().then((tagList) => setTagList(tagList));
  }, []);

  const [tags, setTagsOriginal] = useState<Set<string>>(new Set<string>());
  // setTags를 Immer 래퍼로 재정의
  const setTags = (updater: (draft: Set<string>) => void) => {
    setTagsOriginal(produce(updater));
  };

  const [translateLoading, setTranslateLoading] = useState(false);
  const slug = slugify(enTitle, { lower: true, strict: true });

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "submitted">("idle");

  const tiptapEditor = useTiptapEditor({ editable: true });

  useValidation({ setTitleError, setEnTitleError, checkSlugExists, title, enTitle, slug, post });

  // 컴포넌트가 마운트될 때 게시물 데이터가 있다면 초기화
  useEffect(() => {
    if (!post || !tiptapEditor) return;

    setTitle(post.title);
    setEnTitle(post.en_title);
    setTagsOriginal(new Set(post.tags));
    tiptapEditor.commands.setContent(post.html);
  }, [post, tiptapEditor]);

  // 제목 유효성 검사

  const handleUpload = async () => {
    if (submitState !== "idle") {
      return;
    }
    setSubmitState("loading");
  };

  useEffect(() => {
    if (submitState === "loading" && !isTitleDebouncing && !isEnTitleDebouncing) {
      // Validate form fields
      const html = tiptapEditor!.getHTML();

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
        id: post?.id,
        title,
        en_title: enTitle,
        slug,
        html: html!,
        tags: [...tags],
      });
    }
  }, [submitState, isTitleDebouncing, isEnTitleDebouncing]);

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
    } catch (error) {
      toast.error("번역 중 오류가 발생했습니다.");
      console.error("Translation error:", error);
    }

    setTranslateLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 p-1">
      <div className="flex flex-row items-center justify-between">
        <AutoSave />
        <PrimaryButton className="flex gap-1" onClick={handleUpload} loading={submitState === "loading"}>
          <UploadIcon />
          업로드
        </PrimaryButton>
      </div>
      <div>
        <div className="flex flex-row gap-1 items-center">
          <TitleInput className="w-full" label="제목" placeholder="제목을 입력하세요 (최대 30자)" />
          {post && (
            <PrimaryButton className="text-nowrap bg-amber-400" onClick={() => setTitle(post.title)}>
              <Redo2Icon />
            </PrimaryButton>
          )}
        </div>
        <div className="text-red-400 h-1 m-3">{titleError}</div>
      </div>

      <div>
        <div className="flex flex-row gap-1 items-center">
          <EnTitleInput
            className="w-full"
            placeholder="영어 제목을 입력하세요 (최대 60자)"
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
            disabled={translateLoading}
          />
          <PrimaryButton className="text-nowrap" onClick={handleTranslate} disabled={translateLoading || !title}>
            {translateLoading ? <LoaderCircleIcon className="animate-spin" /> : <WandSparklesIcon />}
          </PrimaryButton>
          {post && (
            <PrimaryButton className="text-nowrap bg-amber-400" onClick={() => setEnTitle(post.en_title)}>
              <Redo2Icon />
            </PrimaryButton>
          )}
        </div>
        <div className="text-red-400 h-1 m-3">{enTitleError}</div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <TagSelector tagList={tagList} tags={tags} setTags={setTags} />
        {post && (
          <PrimaryButton className="text-nowrap bg-amber-400" onClick={() => setTagsOriginal(new Set(post.tags))}>
            <Redo2Icon />
          </PrimaryButton>
        )}
      </div>

      <EditorContent className="py-6 bg-zinc-800 rounded-md" editor={tiptapEditor} />
    </div>
  );
}
