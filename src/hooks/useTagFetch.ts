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
  const playlistCollection = collection(db, 'playlist');

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

  let q: Query<DocumentData>;

  if (tag === '#인기 급상승 동영상') {
    q = query(
      playlistCollection,
      where('isPublic', '==', true),
      orderBy('likes', 'desc'),
      limit(pageSize)
    );
  } else {
    q = query(
      playlistCollection,
      where('isPublic', '==', true),
      where('tags', 'array-contains', tag),
      orderBy('likes', 'desc'),
      limit(pageSize)
    );
  }

  if (pageParam > 0) {
    const previousQuery = query(
      playlistCollection,
      where('isPublic', '==', true),
      tag !== '#인기 급상승 동영상'
        ? where('tags', 'array-contains', tag)
        : where('isPublic', '==', true),
      orderBy('likes', 'desc'),
      limit(pageParam * pageSize)
    );
    const previousSnapshot = await getDocs(previousQuery);
    const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1];

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
  }

  const allPlaylists = await fetchPlaylists(q);
  const nextCursor = allPlaylists.length < pageSize ? null : pageParam + 1;

  return { playlistsData: allPlaylists, nextCursor };
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
