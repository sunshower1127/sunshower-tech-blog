import { createClient } from "@/features/supabase/server";
import { Props } from "@/types/next";
import { redirect } from "next/navigation";

export default async function EditorPage({ params }: Props) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/");
  }

  const slug = (await params)["slug"];

  return <div>EditorPage slug={slug}</div>;
}
