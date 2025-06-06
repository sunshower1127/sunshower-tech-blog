import { useEffect } from "react";
import z from "zod";
import { Post } from "..";

export const postSchema = z.object({
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

export default function useValidation({
  setTitleError,
  setEnTitleError,
  checkSlugExists,
  title,
  enTitle,
  slug,
  post,
}: {
  setTitleError: (error: string) => void;
  setEnTitleError: (error: string) => void;
  checkSlugExists?: (slug: string) => Promise<boolean>;
  title: string;
  enTitle: string;
  slug: string;
  post?: Post;
}) {
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
      return true; // 유효성 검사 통과 시 true 반환
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEnTitleError(error.errors[0].message);
      }
      return false;
    }
  };

  // 슬러그 유효성 검사 (DB 중복 검사 포함)
  const validateSlug = async (value: string) => {
    if (value.trim() && post?.slug && post.slug === value) {
      // 현재 포스트의 슬러그와 동일한 경우는 중복 검사에서 제외
      return true;
    }

    try {
      // 슬러그 중복 검사
      if (checkSlugExists) {
        const exists = await checkSlugExists(value);
        if (exists) {
          setEnTitleError("이미 사용 중인 URL 주소입니다. 다른 영어 제목을 입력해주세요.");
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

  useEffect(() => {
    validateTitle(title);
  }, [title]);

  useEffect(() => {
    validateEnTitle(enTitle) && validateSlug(slug);
  }, [enTitle]);
}
