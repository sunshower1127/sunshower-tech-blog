-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.comments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  author_id uuid,
  post_id bigint NOT NULL,
  text text NOT NULL,
  parent_id bigint,
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(user_id),
  CONSTRAINT comment_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id),
  CONSTRAINT comment_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  html text,
  author_id uuid,
  view_count integer NOT NULL DEFAULT 0,
  like_count integer NOT NULL DEFAULT 0,
  en_title text NOT NULL,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT post_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.profiles (
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_name text UNIQUE,
  user_image text,
  CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);