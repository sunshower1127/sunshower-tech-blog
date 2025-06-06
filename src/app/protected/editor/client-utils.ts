import { CreatePostProps } from "@/features/post";
import { translateText } from "@/features/post/actions";
import { createClient } from "@/features/supabase/client";
import { omit } from "es-toolkit";
import { toast } from "react-toastify";

export const handleCreateFactory =
  (push: (path: string) => void) => async (post: { title: string; en_title: string; slug: string; html: string; tags: string[] }) => {
    const supabase = createClient();

    const author_id = (await supabase.auth.getUser()).data.user?.id;
    if (!author_id) {
      console.error("User not authenticated");
      toast.error("로그인이 필요합니다. 다시 시도해주세요.");
      return;
    }

    console.log("Author ID:", author_id);
    const { data: newPost, error: error1 } = await supabase
      .from("posts")
      .insert<CreatePostProps>({ author_id, ...omit(post, ["tags"]) })
      .select("id")
      .single();

    if (error1 || !newPost.id) {
      console.error("Error submitting post:", error1);
      toast.error("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    const { error: error2 } = await supabase.rpc("update_tags", {
      p_post_id: newPost.id,
      p_tags: post.tags,
    });

    if (error2) {
      console.error("Error updating post tags:", error2);
      toast.error("게시글 태그 업데이트 중 오류가 발생했습니다. 게시글을 수정해주세요.");
      return;
    }

    toast.success("게시글이 성공적으로 작성되었습니다!");
    console.log("Post submitted:", post);
    push(`/`);
  };

export const checkSlugExists = async (slug: string) => {
  if (!slug || !slug.trim()) {
    return false;
  }
  const supabase = createClient();

  const { data } = await supabase.from("posts").select("slug").eq("slug", slug).maybeSingle();
  return !!data;
};

export const translateKR2EN = (enText: string) => {
  const formData = new FormData();
  formData.append("text", enText);
  formData.append("source_lang", "ko");
  formData.append("target_lang", "en");
  return translateText(formData);
};

export const getTagList = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_tag_list", {});
  if (error) {
    console.error("Error fetching tag list:", error);
    toast.error("태그 목록을 불러오는 중 오류가 발생했습니다.");
    return [];
  }
  return data as string[];
};

export const handleUpdateFactory =
  (push: (path: string) => void) => async (post: { id?: number; title: string; en_title: string; slug: string; html: string; tags: string[] }) => {
    const supabase = createClient();

    const author_id = (await supabase.auth.getUser()).data.user?.id;
    if (!author_id) {
      console.error("User not authenticated");
      toast.error("로그인이 필요합니다. 다시 시도해주세요.");
      return;
    }

    console.log("Author ID:", author_id);
    const { error: error1 } = await supabase
      .from("posts")
      .update(omit(post, ["tags"]))
      .eq("id", post.id);

    if (error1) {
      console.error("Error updating post:", error1);
      toast.error("게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    const { error: error2 } = await supabase.rpc("update_tags", {
      p_post_id: post.id,
      p_tags: post.tags,
    });

    if (error2) {
      console.error("Error updating post tags:", error2);
      toast.error("게시글 태그 업데이트 중 오류가 발생했습니다. 게시글을 다시 수정해주세요.");
      return;
    }

    toast.success("게시글이 성공적으로 수정되었습니다!");
    console.log("Post updated:", post);
    push(`/`);
  };
