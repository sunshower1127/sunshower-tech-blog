"use client";

import PrimaryButton from "@/components/primary-button";
import { createClient } from "@/features/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AuthorOnly({ authorId, slug }: { authorId?: string; slug: string }) {
  const [userId, setUserId] = useState<string>("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user || error) {
        return;
      }
      setUserId(data.user.id);
    })();
  }, []);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
      return;
    }
    setIsDeleteLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("slug", slug);
    if (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post. Please try again later.");
      setIsDeleteLoading(false);
      return;
    }
    router.push("/");
  };

  return (
    <div>
      {userId && authorId && userId === authorId && (
        <div className="flex flex-row gap-2 justify-end">
          <PrimaryButton>
            <Link href={`/protected/editor/${slug}`}>Edit</Link>
          </PrimaryButton>
          <PrimaryButton className="bg-red-400" onClick={handleDelete} loading={isDeleteLoading}>
            Delete
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
