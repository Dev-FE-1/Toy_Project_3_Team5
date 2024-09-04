import { useInfiniteQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  limit,
} from 'firebase/firestore';
import { getCommentCount } from '@/api/myplaylists';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

const fetchHomePlaylists = async (
  pageParam: QueryDocumentSnapshot<DocumentData> | null,
  sortOption: string,
  pageSize: number
) => {
  const playlistCollection = collection(db, 'playlist');
  const orderByField = sortOption === '좋아요순' ? 'likes' : 'regDate';
  const orderDirection: 'asc' | 'desc' = 'desc';

  let q = query(
    playlistCollection,
    where('isPublic', '==', true),
    orderBy(orderByField, orderDirection),
    limit(pageSize)
  );

  if (pageParam) q = query(q, startAfter(pageParam));

  const querySnapshot = await getDocs(q);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  const allPlaylists = await Promise.all(
    querySnapshot.docs.map(async (doc) => ({
      playlistId: doc.id,
      commentCount: await getCommentCount(doc.id),
      ...(doc.data() as Omit<PlayListDataProps, 'playlistId' | 'commentCount'>),
    }))
  );

  return { playlistsData: allPlaylists, nextCursor: lastVisible };
};

export const useFetchHomePlaylists = (
  sortOption: string = '최신순',
  pageSize: number = 5
) => {
  const queryOptions = {
    queryKey: ['homePlaylists', sortOption],
    queryFn: async ({
      pageParam,
    }: {
      pageParam?: QueryDocumentSnapshot<DocumentData> | null;
    }) => fetchHomePlaylists(pageParam || null, sortOption, pageSize),
    getNextPageParam: (lastPage: {
      nextCursor: QueryDocumentSnapshot<DocumentData> | null;
    }) => lastPage.nextCursor,
    initialPageParam: null,
  };

  return useInfiniteQuery(queryOptions);
};
