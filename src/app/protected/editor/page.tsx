"use client";

import { CreatePostProps } from "@/features/post";
import { translateText } from "@/features/post/actions";
import PostEditor from "@/features/post/post-editor";
import { createClient } from "@/features/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function NewPostPage() {
  const router = useRouter();

  return (
    <div>
      <PostEditor checkSlugExists={checkSlugExists} onSubmit={handleSubmitFactory(router.push)} translateKR2EN={translateKR2EN} />
    </div>
  );
}

const handleSubmitFactory = (push: (path: string) => void) => async (post: { title: string; en_title: string; slug: string; html: string }) => {
  const supabase = createClient();

  const author_id = (await supabase.auth.getUser()).data.user?.id;
  if (!author_id) {
    console.error("User not authenticated");
    toast.error("로그인이 필요합니다. 다시 시도해주세요.");
    return;
  }
  console.log("Author ID:", author_id);
  const { error } = await supabase.from("posts").insert<CreatePostProps>({ author_id, ...post });

  if (error) {
    console.error("Error submitting post:", error);
    toast.error("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
  toast.success("게시글이 성공적으로 작성되었습니다!");
  console.log("Post submitted:", post);
  push(`/`);
};

const checkSlugExists = async (slug: string) => {
  const supabase = createClient();
  const { count } = await supabase.from("posts").select("slug").eq("slug", slug).single();
  console.log("Slug exists count:", count);
  return !!count && count > 0;
};

const translateKR2EN = (enText: string) => {
  const formData = new FormData();
  formData.append("text", enText);
  formData.append("source_lang", "ko");
  formData.append("target_lang", "en");
  return translateText(formData);
};
