import PostFlatingButton from "@/features/post/floating-button";
import PostHeader from "@/features/post/post-header";

export default function Home() {
  return (
    <>
      <ul>
        {Array.from({ length: 5 }).map((_, i) => (
          <PostHeader key={i} />
        ))}
      </ul>

      <PostFlatingButton />
    </>
  );
}
