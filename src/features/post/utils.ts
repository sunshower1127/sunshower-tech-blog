import defaultUserIcon from "@/assets/default-user-icon.png";
import { PostForHeader, User } from ".";

export function transformRawPost<T extends PostForHeader>(rawPost: any) {
  return {
    ...rawPost,
    created_at: new Date(rawPost.created_at),
    updated_at: rawPost.updated_at ? new Date(rawPost.updated_at) : null,
    author: rawPost.profiles as unknown as User | null,
    profiles: undefined, // Remove profiles to match PostForHeader type
  } as T;
}

// TODO: lucide-react 아이콘으로 변경
export function getDefaultUserIcon() {
  return defaultUserIcon;
}
