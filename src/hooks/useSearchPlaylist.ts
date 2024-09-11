import { useInfiniteQuery } from '@tanstack/react-query';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { fetchSearchPlaylists } from '@/api/searchPlaylists';
import { PlayListDataProps } from '@/types/playlistType';

export const useFetchSearchPlaylists = (
  keyword: string,
  pageSize: number = 5
) =>
  useInfiniteQuery<{
    playlistsData: PlayListDataProps[];
    nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  }>({
    queryKey: ['searchPlaylists', keyword],
    queryFn: async ({ pageParam }) => {
      const snapshot = pageParam as QueryDocumentSnapshot<DocumentData> | null;
      return fetchSearchPlaylists(keyword, snapshot, pageSize);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(keyword),
    initialPageParam: null,
  });
