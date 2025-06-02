import { PostForHeader } from ".";

export default function PostHeader({ post }: { post: PostForHeader }) {
  // const formattedDate = new Intl.DateTimeFormat("ko-KR", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // }).format(post.createdBy);
  console.log("PostHeader post:", post);
  return null;

  // return (
  //   <li className="flex flex-col gap-6 border-b m-10 pb-10 border-zinc-500 hover:text-white">
  //     <p className="flex flex-row gap-2 items-center">
  //       <span className="">{formattedDate}</span>
  //       <span className="">{author}</span>
  //       <img className="w-8 h-8 rounded-full" src={authorIcon} alt={`${author}'s profile picture`} />
  //     </p>
  //     <Link className="contents" href={`/posts/${postSlug}`}>
  //       <h1 className="text-4xl font-bold text-wrap break-keep wrap-anywhere">{title}</h1>
  //     </Link>
  //   </li>
  // );
}
