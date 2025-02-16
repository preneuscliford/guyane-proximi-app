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
export type Comments = {
   id: number;
  text: string;
  created_at: string;
  userId: string;
  postId: number;
  profiles: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
};

// interface Comment {

// }

// interface CommentSectionProps {
//   postId: string;
//   currentUser: any;
//   comments: Comment[];
//   onCommentAdded: () => void;
// }