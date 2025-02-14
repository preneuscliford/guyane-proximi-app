import { getNewPosts, PAGE_SIZE } from "@/lib/supabase";
import { Post } from "@/types/postTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";



export const usePaginatedPosts = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const query = useQuery({
    queryKey: ['getNewPosts', page],
    queryFn: () => getNewPosts(page),

  });

  useEffect(() => {
    if (query.data?.data) {
      setAllPosts(prev => [...prev, ...query.data.data]);
    }
  }, [query.data?.data]);

  const totalPages = Math.ceil((query.data?.totalCount || 0) / PAGE_SIZE);
  const hasMore = page < totalPages;

  const loadMore = () => {
    if (hasMore && !query.isFetching) {
      setPage(prev => prev + 1);
    }
  };

  return {
    ...query,
    data: allPosts,
    loadMore,
    hasMore
  };
};