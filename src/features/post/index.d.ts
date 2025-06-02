export interface Post {
  id: number;
  created_at: string;
  updated_at?: string;
  title: string;
  en_title: string;
  slug: string;
  html: string;
  author: {
    id: string;
    user_name: string;
    user_icon: string;
  };
  view_count: number;
  like_count: number;
}

export interface PostForHeader {
  title: string;
  en_title: string;
  slug: string;
  created_at: string;
  updated_at?: string;
  author: {
    id: string;
    user_name: string;
    user_icon: string;
  };
  view_count: number;
  like_count: number;
}

export interface PostViwerProps {
  created_at: string;
  updated_at?: string;
  title: string;
  html: string;
  author: {
    user_name: string;
    user_icon: string;
  };
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
