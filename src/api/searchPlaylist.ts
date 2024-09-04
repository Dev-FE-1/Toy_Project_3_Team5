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
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

const fetchSearchPlaylists = async (
  keyword: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null,
  pageSize: number = 5
): Promise<{
  playlistsData: PlayListDataProps[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}> => {
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

  let querySnapshot = await getDocs(q);
  let allPlaylistsData: PlayListDataProps[] = [];
  let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  const filteredData = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PlayListDataProps, 'id'>),
    }))
    .filter((playlist) =>
      playlist.title.toLowerCase().includes(keyword.toLowerCase())
    );

  allPlaylistsData = [...allPlaylistsData, ...filteredData];

  while (allPlaylistsData.length < pageSize && querySnapshot.docs.length > 0) {
    q = query(
      playlistCollection,
      where('isPublic', '==', true),
      orderBy('title'),
      orderBy('regDate', 'desc'),
      startAfter(lastVisible),
      limit(pageSize)
    );

    querySnapshot = await getDocs(q);
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    const additionalData = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PlayListDataProps, 'id'>),
      }))
      .filter((playlist) =>
        playlist.title.toLowerCase().includes(keyword.toLowerCase())
      );

    allPlaylistsData = [...allPlaylistsData, ...additionalData];
  }

  const playlistsData = allPlaylistsData.slice(0, pageSize);
  const nextCursor = querySnapshot.docs.length === 0 ? null : lastVisible;

  return { playlistsData, nextCursor };
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
