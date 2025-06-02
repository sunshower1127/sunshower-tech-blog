import { Post } from "@/features/post";
import PostViewer from "@/features/post/post-viewer";
import { createClient } from "@/features/supabase/server";
import { Props } from "@/types/next";

export default async function PostViewPage({ params }: Props) {
  const slug = (await params).slug;
  const supabase = await createClient();

  const { data: post, error: postError } = await supabase.from("posts").select("*").eq("slug", slug).single<Post>();
  if (!post) {
    return <div>{postError.message}</div>;
  }

  const { data: author, error: authorError } = await supabase.from("users").select("user_name, user_icon").eq("id", post.author_id).single();
  if (!author) {
    return <div>{authorError.message}</div>;
  }
  console.log("Post data:", post);

  return <PostViewer author={author} {...post} />; // Ensure post has all required fields
}
