import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  startAfter,
  limit,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { getCommentCount } from '@/api/myplaylists';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

export const fetchHomePlaylists = async (
  pageParam: number,
  sortOption: string,
  pageSize: number
): Promise<{
  playlistsData: PlayListDataProps[];
  nextCursor: number | null;
}> => {
  const playlistCollection = collection(db, 'playlist');
  const isCommentSort = sortOption === '댓글순';
  const orderByField = sortOption === '좋아요순' ? 'likes' : 'regDate';

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

  if (isCommentSort) {
    const q = query(
      playlistCollection,
      where('isPublic', '==', true),
      orderBy('regDate', 'desc')
    );

    const allPlaylists = await fetchPlaylists(q);
    allPlaylists.sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));

    const startIndex = pageParam * pageSize;
    const paginatedData = allPlaylists.slice(startIndex, startIndex + pageSize);
    const nextCursor =
      startIndex + pageSize < allPlaylists.length ? pageParam + 1 : null;

    return { playlistsData: paginatedData, nextCursor };
  } else {
    let q = query(
      playlistCollection,
      where('isPublic', '==', true),
      orderBy(orderByField, 'desc'),
      limit(pageSize)
    );

    if (pageParam > 0) {
      const previousQuery = query(
        playlistCollection,
        where('isPublic', '==', true),
        orderBy(orderByField, 'desc'),
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
  }
};
