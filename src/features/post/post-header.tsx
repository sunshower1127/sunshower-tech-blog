import Link from "next/link";

export default function PostHeader({
  title = "가나다라마바사아 자차카타 파하아아아아아아아",
  subTitle = "부제목이 있다면 여기에",
  author = "김선우",
  authorIcon = "https://avatars.githubusercontent.com/u/147628203?v=4",
  createdBy = new Date(),
  postSlug = "abc-dkdfsed",
}: {
  title?: string;
  author?: string;
  createdBy?: Date;
  subTitle?: string;
  authorIcon?: string;
  postSlug?: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(createdBy);

  return (
    <li className="flex flex-col gap-6 border-b m-10 pb-10 border-zinc-500 hover:text-white">
      <p className="flex flex-row gap-2 items-center">
        <span className="">{formattedDate}</span>
        <span className="">{author}</span>
        <img className="w-8 h-8 rounded-full" src={authorIcon} alt={`${author}'s profile picture`} />
      </p>
      <Link className="contents" href={`/posts/${postSlug}`}>
        <h1 className="text-4xl font-bold text-wrap break-keep wrap-anywhere">{title}</h1>
        <h2 className="">{subTitle}</h2>
      </Link>
    </li>
  );
}
