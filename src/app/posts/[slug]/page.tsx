import { Props } from "@/types/next";

export default async function PostViewPage({ params }: Props) {
  const slug = (await params).slug;

  return <div>PostViewPage slug="{slug}"</div>;
}
