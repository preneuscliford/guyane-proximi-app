import { Post, PostsResponse } from "@/types/postTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("EXPO_PUBLIC_SUPABASE_URL environment variable is missing");
}
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable is missing"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const PAGE_SIZE = 10;
export const getNewPosts = async (pageParam: number = 1) => {
  // 1. Modifier la fonction de service pour accepter la pagination

  const from = (pageParam - 1) * PAGE_SIZE;

  const { data, error, count } = await supabase
    .from("posts")
    .select("*, profiles(*), post_likes(*), comments(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw new Error(error.message);
  return {
    data: (data || []) as Post[],
    totalCount: count || 0,
    currentPage: pageParam,
  };
};

export const getTrendingPosts = async (pageParam: number = 1) => {
  const from = (pageParam - 1) * PAGE_SIZE;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Étape 1 : Récupération brute
  const { data, error, count } = await supabase
    .from("posts")
    .select("*, profiles(*), post_likes(*), comments(*)", { count: "exact" })
    .gt("created_at", oneWeekAgo.toISOString())
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw new Error(error.message);

  // Étape 2 : Calcul côté client
  const scoredPosts = (data || []).map((post) => ({
    ...post,
    score: calculatePostScore(post), // Fonction de scoring
  }));

  return {
    data: scoredPosts.sort((a, b) => b.score - a.score) as Post[],
    totalCount: count || 0,
    currentPage: pageParam,
  };
};

// Fonction dédiée aux posts de l'utilisateur
export const getUserPosts = async (pageParam: number = 1, userId: string) => {
  if (!userId) throw new Error("User ID required");

  const from = (pageParam - 1) * PAGE_SIZE;

  const { data, error, count } = await supabase
    .from("posts")
    .select("*, profiles(*), postLikes(*), comments(*)", { count: "exact" })
    .eq("userId", userId)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw new Error(error.message);
  return {
    data: data as Post[],
    totalCount: count || 0,
    currentPage: pageParam,
  };
};

// Helper pour le calcul de score
const calculatePostScore = (post: Post) => {
  const timeDiff = Date.now() - new Date(post.created_at).getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  return (
    (post.post_likes.length * 2 + post.comments.length) /
    Math.pow(hoursDiff + 1, 1.8)
  );
};
