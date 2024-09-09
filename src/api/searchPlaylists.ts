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

const fetchPlaylists = async (
  keyword: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null,
  pageSize: number
) => {
  const playlistCollection = collection(db, 'playlist');
  let q = query(
    playlistCollection,
    where('isPublic', '==', true),
    orderBy('title'),
    orderBy('regDate', 'desc'),
    limit(pageSize)
  );

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const querySnapshot = await getDocs(q);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  const allPlaylists = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const commentCount = await getCommentCount(doc.id);

      return {
        playlistId: doc.id,
        commentCount,
        ...(doc.data() as Omit<
          PlayListDataProps,
          'playlistId' | 'commentCount'
        >),
      };
    })
  );

  let filteredData;

  if (keyword.startsWith('#')) {
    filteredData = allPlaylists.filter((playlist) =>
      playlist.tags?.includes(keyword)
    );
  } else {
    filteredData = allPlaylists.filter((playlist) =>
      playlist.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  return { filteredData, lastVisible };
};

const fetchSearchPlaylists = async (
  keyword: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null,
  pageSize: number = 5
): Promise<{
  playlistsData: PlayListDataProps[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  const allPlaylistsData: PlayListDataProps[] = [];
  let lastVisible: QueryDocumentSnapshot<DocumentData> | null = pageParam;

  do {
    const { filteredData, lastVisible: newLastVisible } = await fetchPlaylists(
      keyword,
      lastVisible,
      pageSize
    );

    allPlaylistsData.push(...filteredData);
    lastVisible = newLastVisible;
  } while (allPlaylistsData.length < pageSize && lastVisible);

  return {
    playlistsData: allPlaylistsData.slice(0, pageSize),
    nextCursor: allPlaylistsData.length < pageSize ? null : lastVisible,
  };
};

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
