import { PostForHeader } from "@/features/post";
import PostFlatingButton from "@/features/post/floating-button";
import PostHeader from "@/features/post/post-header";
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
        id,
        user_name,
        user_icon
      )
      `
    )
    .order("created_at", { ascending: false });
  if (!rawPosts) {
    return <div>{error.message}</div>;
  }

  const posts = rawPosts.map(
    (post) =>
      ({
        ...post,
        author: {
          id: post.profiles[0].id,
          user_name: post.profiles[0].user_name,
          user_icon: post.profiles[0].user_icon,
        },
        profiles: undefined, // Remove profiles to match PostForHeader type
      } as PostForHeader)
  );

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
