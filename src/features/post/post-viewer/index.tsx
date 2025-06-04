import Image from "next/image";
import { Post } from "..";
import TitapViewer from "../../tiptap/viewer";
import { getDefaultUserIcon } from "../utils";
import AuthorOnly from "./author-only";

// TODO: 디자인 필요
export default async function PostViewer({ post: { author, created_at, en_title, html, title, updated_at, view_count, slug } }: { post: Post }) {
  return (
    <div className="flex flex-col gap-5 border *:border">
      <AuthorOnly authorId={author?.user_id} slug={slug} />
      <h1>{title}</h1>
      <h2>{en_title}</h2>
      <div>{view_count} views</div>
      <div>{created_at.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" })}</div>
      <div>{updated_at && "(" + updated_at.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" }) + " 수정됨)"}</div>
      <div>{author?.user_name || "(알수없음)"}</div>
      <Image className="rounded-full" alt="user image" width={32} height={32} src={author?.user_image || getDefaultUserIcon()} />
      <TitapViewer initialContent={html} />
    </div>
  );
}
