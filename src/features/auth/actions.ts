"use server";

import { createClient } from "@/features/supabase/server";
import { getOrigin } from "@/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?error_message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${getOrigin()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error_message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/login?success_message=Check your email for the confirmation link");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

const AVAILABLE_PROVIDERS = ["github"];
type AvailableProviders = "github";

export async function loginWithOAuth(formData: FormData) {
  const provider = formData.get("provider") as string;

  if (!AVAILABLE_PROVIDERS.includes(provider)) {
    redirect(`/login?error_message=${encodeURIComponent("Invalid provider")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as AvailableProviders,
    options: {
      redirectTo: `${getOrigin()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error_message=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    // redirect to the OAuth provider's login page
    return redirect(data.url);
  }
  revalidatePath("/", "layout");
  redirect("/");
}
