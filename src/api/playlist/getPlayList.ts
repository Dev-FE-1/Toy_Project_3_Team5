import {
  collection,
  query,
  getDoc,
  getDocs,
  orderBy,
  where,
  doc,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
} from 'firebase/firestore';
import checkUserAuth from '@/api/checkUserAuth';
import getCommentCount from '@/api/getCommentCount';
import getOwnerChannelName from '@/api/getOwnerChannelName';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

interface PaginatedResult {
  playlists: PlayListDataProps[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

const ITEMS_PER_PAGE = 10;

const playlistData = async (
  doc: QueryDocumentSnapshot<unknown>
): Promise<PlayListDataProps> => {
  const playlistData = doc.data() as DocumentData;
  const commentCount = await getCommentCount(doc.id);
  const ownerChannelName = await getOwnerChannelName(playlistData.userId);

  return {
    playlistId: doc.id,
    title: playlistData.title || 'Untitled',
    description: playlistData.description || '',
    isPublic: playlistData.isPublic || false,
    likes: playlistData.likes || 0,
    links: playlistData.links || [],
    regDate: playlistData.regDate || '',
    tags: playlistData.tags || [],
    thumbNail: playlistData.thumbNail || 'not valid thumbnail',
    userId: playlistData.userId || '',
    commentCount,
    ownerChannelName,
  };
};

// 공통 쿼리 실행 함수
const executeQuery = async (
  q: Query<DocumentData>
): Promise<PaginatedResult> => {
  const querySnapshot = await getDocs(q);
  const playlists = await Promise.all(querySnapshot.docs.map(playlistData));

  const newLastVisible =
    querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  const hasMore = querySnapshot.docs.length === ITEMS_PER_PAGE;

  return { playlists, lastVisible: newLastVisible, hasMore };
};

// 로그인한 유저가 생성한 플레이리스트 최신순으로 정렬
export const getUserPlayList = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult> => {
  try {
    const user = checkUserAuth();
    const playlistRef = collection(db, 'playlist');
    let q = query(
      playlistRef,
      where('userId', '==', user.uid),
      orderBy('regDate', 'desc'),
      limit(ITEMS_PER_PAGE)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    return await executeQuery(q);
  } catch (error) {
    console.error('플레이리스트를 가져오는 중 오류가 발생했습니다:', error);
    return { playlists: [], lastVisible: null, hasMore: false };
  }
};

// 로그인한 유저가 좋아요 누른 플레이리스트 최신순으로 정렬
export const getLikedPlaylist = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult> => {
  try {
    const user = checkUserAuth();
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { playlists: [], lastVisible: null, hasMore: false };
    }

    const userData = userDocSnap.data();
    const likedPlaylistIds = userData?.likePlaylist || [];

    const validLikedPlaylistIds = likedPlaylistIds
      .map((id: unknown) => id?.toString())
      .filter(
        (id: string | undefined): id is string =>
          typeof id === 'string' && id.trim() !== ''
      );

    if (validLikedPlaylistIds.length === 0) {
      return { playlists: [], lastVisible: null, hasMore: false };
    }

    const playlistRef = collection(db, 'playlist');
    let q = query(
      playlistRef,
      where('__name__', 'in', validLikedPlaylistIds),
      orderBy('regDate', 'desc'),
      limit(ITEMS_PER_PAGE)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    return await executeQuery(q);
  } catch (error) {
    console.error(
      '좋아요한 플레이리스트를 가져오는 중 오류가 발생했습니다:',
      error
    );
    return { playlists: [], lastVisible: null, hasMore: false };
  }
};

// 로그인한 유저가 저장한 플레이리스트 최신순으로 정렬
export const getSavedPlaylist = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult> => {
  try {
    const user = checkUserAuth();
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { playlists: [], lastVisible: null, hasMore: false };
    }

    const userData = userDocSnap.data();
    const savedPlaylistsIds = userData?.followingPlaylist || [];

    const validSavedPlaylistIds = savedPlaylistsIds
      .map((id: unknown) => id?.toString())
      .filter(
        (id: string | undefined): id is string =>
          typeof id === 'string' && id.trim() !== ''
      );

    if (validSavedPlaylistIds.length === 0) {
      return { playlists: [], lastVisible: null, hasMore: false };
    }

    const playlistRef = collection(db, 'playlist');
    let q = query(
      playlistRef,
      where('__name__', 'in', validSavedPlaylistIds),
      orderBy('regDate', 'desc'),
      limit(ITEMS_PER_PAGE)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    return await executeQuery(q);
  } catch (error) {
    console.error(
      '저장된 플레이리스트를 가져오는 중 오류가 발생했습니다:',
      error
    );
    return { playlists: [], lastVisible: null, hasMore: false };
  }
};
