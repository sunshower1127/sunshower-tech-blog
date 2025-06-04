export interface User {
  user_id: string;
  user_name: string | null;
  user_image: string | null;
}
export interface Post {
  id: number;
  created_at: Date;
  updated_at: Date | null;
  title: string;
  en_title: string;
  slug: string;
  html: string;
  author: User | null;
  view_count: number;
  like_count: number;
}

export type PostForHeader = Omit<Post, "id" | "html">;

export interface PostViwerProps {
  created_at: string;
  updated_at?: string;
  title: string;
  html: string;
  author: User;
  view_count: number;
  like_count: number;
}

export interface CreatePostProps {
  title: string;
  en_title: string;
  slug: string;
  html: string;
  author_id: string;
}
