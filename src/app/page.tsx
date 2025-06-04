import { PostForHeader } from "@/features/post";
import PostFlatingButton from "@/features/post/floating-button";
import PostHeader from "@/features/post/post-header";
import { transformRawPost } from "@/features/post/utils";
import { createClient } from "@/features/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: rawPosts, error } = await supabase
    .from("posts")
    .select(
      `
      title, 
      en_title, 
      slug, 
      view_count, 
      like_count, 
      created_at, 
      updated_at,
      profiles (
        user_id,
        user_name,
        user_image
      )
      `
    )
    .order("created_at", { ascending: false }); // TODO: 페이지네이션
  if (!rawPosts) {
    return <div>{error.message}</div>;
  }

  const posts = rawPosts.map((rawPost) => transformRawPost<PostForHeader>(rawPost));

  return (
    <>
      <ul>
        {posts.map((post) => (
          <PostHeader key={post.slug} post={post} />
        ))}
      </ul>

      <PostFlatingButton />
    </>
  );
}
