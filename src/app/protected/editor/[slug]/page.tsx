"use client";
import { Post } from "@/features/post";
import PostEditor from "@/features/post/post-editor";
import { transformRawPost } from "@/features/post/utils";
import { createClient } from "@/features/supabase/client";
import { useParams, useRouter } from "next/navigation"; // redirect 제거, useParams 추가
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { checkSlugExists, getTagList, handleUpdateFactory, translateKR2EN } from "../client-utils";

export default function EditorPage() {
  // params 제거
  const router = useRouter();
  const params = useParams(); // useParams 훅 사용
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const slug = params.slug as string; // params에서 slug 추출
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(user_id, user_name, user_image), tags(name)")
        .eq("slug", slug)
        .single();
      if (error) {
        console.error("Error fetching post:", error);
        toast.error("게시물을 불러오는 중 오류가 발생했습니다.");
        return;
      }
      setPost(transformRawPost<Post>(data));
    })();
  }, []);

  return (
    <div>
      <PostEditor
        post={post}
        getTagList={getTagList}
        onSubmit={handleUpdateFactory(router.push)}
        checkSlugExists={checkSlugExists}
        translateKR2EN={translateKR2EN}
      />
    </div>
  );
}
