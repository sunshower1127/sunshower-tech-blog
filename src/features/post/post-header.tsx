import Image from "next/image";
import Link from "next/link";
import { PostForHeader } from ".";
import { getDefaultUserIcon } from "./utils";

export default function PostHeader({ post: { author, created_at, en_title, slug, title, updated_at, view_count, tags } }: { post: PostForHeader }) {
  updated_at = new Date();

  return (
    <li className="flex flex-col gap-6 border-b m-10 pb-10 border-zinc-500 hover:text-white">
      <div className="flex flex-row gap-1 items-baseline w-full">
        <span>{created_at.toLocaleDateString(undefined, { dateStyle: "short" })}</span>
        <span>{updated_at && "(" + updated_at.toLocaleDateString(undefined, { dateStyle: "short" }) + " 수정됨)"}</span>
        <Link className="flex flex-row gap-2 items-baseline ml-2" href={`/users/${author?.user_name || ""}`}>
          <Image className="rounded-full translate-y-1" width={32} height={32} alt="user image" src={author?.user_image || getDefaultUserIcon()} />
          <div className="">{author?.user_name || "(알수없음)"}</div>
        </Link>
        <div className="ml-auto">{view_count} views</div>
      </div>
      <Link className="contents" href={`/posts/${slug}`}>
        <h1 className="text-4xl font-bold text-wrap break-keep wrap-anywhere">{title}</h1>
        <h2 className="text-2xl text-zinc-400 font-medium">{en_title}</h2>
      </Link>
      <ul className="flex flex-row gap-2 flex-wrap">
        {tags.map((tag) => (
          <li key={tag} className="bg-zinc-600 px-2 py-1 rounded-md text-sm">
            <Link href={`?tags=${encodeURIComponent("[" + tag + "]")}`} className="text-white hover:text-zinc-200">
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
