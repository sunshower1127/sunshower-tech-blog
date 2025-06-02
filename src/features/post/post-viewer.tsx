import { PostViwerProps } from ".";
import TitapViewer from "../tiptap/viewer";

export default function PostViewer(post: PostViwerProps) {
  return (
    <div className="flex flex-col gap-5 border *:border">
      <h1>{post.title}</h1>
      <div>{post.created_at}</div>
      <div>{post.author.user_name}</div>
      <img src={post.author.user_icon} />
      <TitapViewer initialContent={post.html} />
    </div>
  );
}
