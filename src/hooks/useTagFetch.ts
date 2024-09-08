import { useInfiniteQuery } from '@tanstack/react-query';
import {
  query,
  where,
  orderBy,
  collection,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  Query,
} from 'firebase/firestore';
import { getCommentCount } from '@/api/myplaylists';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

const fetchPlaylistsByTag = async (
  tag: string,
  pageParam: number,
  pageSize: number
): Promise<{
  playlistsData: PlayListDataProps[];
  nextCursor: number | null;
}> => {
  let q;

  if (tag === '인기 급상승 동영상') {
    q = query(collection(db, 'playlist'), orderBy('likes', 'desc'), limit(5));
  } else {
    q = query(
      collection(db, 'playlist'),
      where('tags', 'array-contains', `#${tag}`),
      where('isPublic', '==', true),
      orderBy('likes', 'desc'),
      limit(pageSize)
    );
  }

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const fetchPlaylists = async (q: Query<DocumentData>) => {
    const querySnapshot = await getDocs(q);

    return await Promise.all(
      querySnapshot.docs.map(async (doc) => ({
        playlistId: doc.id,
        commentCount: await getCommentCount(doc.id),
        ...(doc.data() as Omit<
          PlayListDataProps,
          'playlistId' | 'commentCount'
        >),
      }))
    );
  };

  const allPlaylists = await fetchPlaylists(q);

  const startIndex = pageParam * pageSize;
  const paginatedData = allPlaylists.slice(startIndex, startIndex + pageSize);

  const nextCursor =
    startIndex + pageSize < allPlaylists.length ? pageParam + 1 : null;

  return { playlistsData: paginatedData, nextCursor };
};

const useTagFetch = (tag: string, pageSize: number = 5) =>
  useInfiniteQuery({
    queryKey: ['popularPlaylists', tag],
    queryFn: ({ pageParam = 0 }) =>
      fetchPlaylistsByTag(tag, pageParam, pageSize),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!tag,
  });

export default useTagFetch;
