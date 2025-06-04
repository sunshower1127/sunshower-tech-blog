import { Post } from "@/features/post";
import PostViewer from "@/features/post/post-viewer";
import { transformRawPost } from "@/features/post/utils";
import { createClient } from "@/features/supabase/server";
import { Props } from "@/types/next";

export default async function PostViewPage({ params }: Props) {
  const slug = (await params).slug;
  const supabase = await createClient();

  const { data: rawPost, error } = await supabase.from("posts").select("*, profiles(user_id, user_name, user_image)").eq("slug", slug).single();

  if (!rawPost) {
    return <div>{error?.message}</div>;
  }

  supabase.rpc("increment_view_count", { post_slug: slug });

  const post = transformRawPost<Post>(rawPost);

  return <PostViewer post={post} />; // Ensure post has all required fields
}
