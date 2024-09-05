import { useInfiniteQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  DocumentData,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  limit,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

interface PlaylistsResultProps {
  playlist: PlayListDataProps[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}

const getOwnerChannelName = async (userId: string): Promise<string> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData?.channelName || '알 수 없는 채널';
    } else {
      console.log('userId에 대한 사용자 문서를 찾을 수 없습니다:', userId);
      return '알 수 없는 채널';
    }
  } catch (error) {
    console.error('채널 이름을 가져오는 동안 오류 발생:', error);
    return '알 수 없는 채널';
  }
};

const fetchFollowingPlaylists = async (
  userId: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null
): Promise<PlaylistsResultProps> => {
  const q = query(
    collection(db, 'playlist'),
    where('userId', '==', userId),
    orderBy('regDate', 'desc'),
    limit(10), // 예시로 10개씩 가져오는 경우
    ...(pageParam ? [startAfter(pageParam)] : [])
  );

  const querySnapshot = await getDocs(q);
  const playlistPromises = querySnapshot.docs.map(async (doc) => {
    const data = doc.data();
    const ownerChannelName = await getOwnerChannelName(data.userId);
    return {
      playlistId: doc.id,
      ownerChannelName,
      title: data.title,
      isPublic: data.isPublic,
      likes: data.likes,
      links: data.links,
      regDate: data.regDate,
      tags: data.tags,
      thumbnail: data.thumbnail,
      userId: data.userId,
    };
  });

  // 모든 Promise를 해결한 후에 결과를 반환
  const playlist = await Promise.all(playlistPromises);

  const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { playlist, nextCursor };
};

const useFollowingPlaylistFetch = (userId: string) =>
  useInfiniteQuery({
    queryKey: ['followingPlaylists', userId],
    queryFn: ({ pageParam = null }) =>
      fetchFollowingPlaylists(userId, pageParam),
    getNextPageParam: (lastPage: PlaylistsResultProps) => lastPage.nextCursor,
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    enabled: !!userId,
  });

export default useFollowingPlaylistFetch;
