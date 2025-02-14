// types.ts
export type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  post_likes: Array<{ id: string }>;
  comments: Array<{ id: string }>;
  score?: number; // Uniquement pour les tendances
};

export type PostsResponse = {
  data: Post[];
  count: number | null;
  error?: string;
};