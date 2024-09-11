import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchHomePlaylists } from '@/api/homePlaylists';

export const useFetchHomePlaylists = (sortOption = '최신순', pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ['homePlaylists', sortOption],
    queryFn: ({ pageParam = 0 }) =>
      fetchHomePlaylists(pageParam, sortOption, pageSize),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
