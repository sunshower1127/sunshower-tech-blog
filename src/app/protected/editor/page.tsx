"use client";

import PostEditor from "@/features/post/post-editor";
import { useRouter } from "next/navigation";
import { checkSlugExists, getTagList, handleCreateFactory, translateKR2EN } from "./client-utils";

// TODO: 글쓰고 있을때 종료나 뒤로가기 방지하기

export default function NewPostPage() {
  const router = useRouter();
  return (
    <div>
      <PostEditor
        checkSlugExists={checkSlugExists}
        onSubmit={handleCreateFactory(router.push)}
        translateKR2EN={translateKR2EN}
        getTagList={getTagList}
      />
    </div>
  );
}
