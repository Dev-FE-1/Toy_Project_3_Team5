import { useInfiniteQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  where,
  getDoc,
  doc,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

type PlaylistPageType = 'user' | 'liked' | 'saved';

interface PlaylistsResultProps {
  playlist: PlayListDataProps[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}

const playlistKeys = {
  all: ['playlist'] as const,
  userList: (userId: string) => [...playlistKeys.all, 'user', userId] as const,
  userLikedList: (userId: string) =>
    [...playlistKeys.all, 'liked', userId] as const,
  userSavedList: (userId: string) =>
    [...playlistKeys.all, 'saved', userId] as const,
};

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

export const getCommentCount = async (playlistId: string): Promise<number> => {
  try {
    const commentsRef = collection(db, 'comments');
    const numericPlaylistId = parseInt(playlistId, 10);
    if (isNaN(numericPlaylistId)) {
      return 0;
    }
    const q = query(commentsRef, where('playlistId', '==', numericPlaylistId));
    const querySnapshot = await getDocs(q);
    const count = querySnapshot.size;
    return count;
  } catch (error) {
    console.error('댓글 수 가져오기 오류:', error);
    return 0;
  }
};

const fetchPlaylists = async (
  userId: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null,
  pageSize: number,
  useDelay: boolean = false,
  type: PlaylistPageType
): Promise<PlaylistsResultProps> => {
  if (useDelay) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const userData = userDocSnap.data();
  const playlistRef = collection(db, 'playlist');
  let q;

  switch (type) {
    case 'user':
      q = query(
        playlistRef,
        where('userId', '==', userId),
        orderBy('regDate', 'desc'),
        limit(pageSize)
      );
      break;
    case 'liked':
    case 'saved':
      const playlistIdStrings =
        (type === 'liked' ? userData.likedPlaylist : userData.savedPlaylist) ||
        [];

      if (playlistIdStrings.length === 0) {
        return { playlist: [], nextCursor: null };
      }

      q = query(
        playlistRef,
        where('__name__', 'in', playlistIdStrings.map(String)),
        orderBy('regDate', 'desc'),
        limit(pageSize)
      );
      break;
    default:
      throw new Error(`잘못된 재생 목록 유형: ${type}`);
  }

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const querySnapshot = await getDocs(q);
  const playlistPromises = querySnapshot.docs.map(async (doc) => {
    const data = doc.data();
    const ownerChannelName = await getOwnerChannelName(data.userId);
    const commentCount = await getCommentCount(doc.id);

    return {
      playlistId: doc.id,
      title: data.title,
      isPublic: data.isPublic,
      likes: data.likes,
      links: data.links,
      regDate: data.regDate,
      tags: data.tags,
      thumbnail: data.thumbnail,
      userId: data.userId,
      ownerChannelName,
      commentCount,
    };
  });

  const playlist: PlayListDataProps[] = await Promise.all(playlistPromises);
  const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { playlist, nextCursor };
};

const createPlaylistQuery =
  (type: PlaylistPageType) =>
  (pageSize: number, useDelay: boolean = false) => {
    const { userId } = useParams<{ userId: string }>();

    let queryKeyFn;
    switch (type) {
      case 'user':
        queryKeyFn = playlistKeys.userList;
        break;
      case 'liked':
        queryKeyFn = playlistKeys.userLikedList;
        break;
      case 'saved':
        queryKeyFn = playlistKeys.userSavedList;
        break;
      default:
        throw new Error(`잘못된 재생 목록 유형: ${type}`);
    }

    return useInfiniteQuery({
      queryKey: queryKeyFn(userId || ''),
      queryFn: ({ pageParam }) => {
        if (!userId) {
          throw new Error('URL에 사용자 ID가 존재하지 않습니다.');
        }
        return fetchPlaylists(
          userId,
          pageParam as QueryDocumentSnapshot<DocumentData> | null,
          pageSize,
          useDelay,
          type
        );
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
      enabled: !!userId,
    });
  };

export const useFetchUserPlaylist = createPlaylistQuery('user');
export const useFetchLikedPlaylist = createPlaylistQuery('liked');
export const useFetchSavedPlaylist = createPlaylistQuery('saved');
