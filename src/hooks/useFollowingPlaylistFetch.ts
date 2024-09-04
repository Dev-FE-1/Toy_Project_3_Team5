import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';
import { PlayListDataProps } from '@/types/playlistType';

const useFollowingPlaylistFetch = (userId: string) => {
  const { userId: loginId } = useAuthStore();
  const [playlists, setPlaylists] = useState<PlayListDataProps[]>([]);

  const fetchPlaylists = useCallback(async () => {
    const loginEmail: string | null = loginId;
    const emailPrefix = loginEmail ? loginEmail.split('@')[0] : '';
    if (userId === emailPrefix) {
      //  특정 사용자 문서에서 channelFollowing 배열 가져오기
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const { channelFollowing } = userDocSnap.data();

        const usersQuery = query(
          collection(db, 'users'),
          where('uid', 'in', channelFollowing)
        );

        const usersSnapshot = await getDocs(usersQuery);
        const channelFollowingDocs = usersSnapshot.docs.map((doc) => doc.id);

        // 이 부분을 사용하여 필요한 로직을 작성합니다.

        if (channelFollowingDocs && channelFollowingDocs.length > 0) {
          // channelFollowing 배열에 포함된 userId들을 기준으로 playlist 문서 가져오기
          const playlistsQuery = query(
            collection(db, 'playlist'),
            where('userId', 'in', channelFollowingDocs)
          );

          const querySnapshot = await getDocs(playlistsQuery);

          const fetchedPlaylists = querySnapshot.docs.map((doc) => {
            const data = doc.data() as PlayListDataProps;
            return {
              ...data,
              playlistId: doc.id,
            };
          });

          setPlaylists(fetchedPlaylists);
        }
      } else {
        return 0;
      }
    } else {
      const playlistsQuery = query(
        collection(db, 'playlist'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(playlistsQuery);

      const fetchedPlaylists = querySnapshot.docs.map((doc) => {
        const data = doc.data() as PlayListDataProps;
        return {
          ...data,
          playlistId: doc.id,
        };
      });

      setPlaylists(fetchedPlaylists);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchPlaylists();
    }
  }, [userId, fetchPlaylists]);

  return playlists;
};

export default useFollowingPlaylistFetch;
