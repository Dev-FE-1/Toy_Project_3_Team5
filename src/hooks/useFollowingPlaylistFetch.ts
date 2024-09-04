import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { PlayListDataProps } from './usePlaylist';
import { db } from '@/firebase/firbaseConfig';
import { loginInfo } from '@/pages/common/Following';

const useFollowingPlaylistFetch = (userId: string) => {
  const [playlists, setPlaylists] = useState<PlayListDataProps[]>([]);

  const fetchPlaylists = useCallback(async () => {
    if (userId === loginInfo.user.uid) {
      //  특정 사용자 문서에서 channelFollowing 배열 가져오기
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const { channelFollowing } = userDocSnap.data();

        if (channelFollowing && channelFollowing.length > 0) {
          // channelFollowing 배열에 포함된 userId들을 기준으로 playlist 문서 가져오기
          const playlistsQuery = query(
            collection(db, 'playlist'),
            where('userId', 'in', channelFollowing)
          );

          const querySnapshot = await getDocs(playlistsQuery);

          const fetchedPlaylists = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              title: data.title || '',
              userName: data.userId || '',
              tags: data.tags || [],
              numberOfComments: 10,
              numberOfLikes: data.likes || 0,
              publicity: data.isPublic ?? false,
              links: data.links || [],
            };
          });

          setPlaylists(fetchedPlaylists);
        }
      } else {
        console.log('No such user document!');
      }
    } else {
      const playlistsQuery = query(
        collection(db, 'playlist'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(playlistsQuery);

      const fetchedPlaylists = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          userName: data.userId || '',
          tags: data.tags || [],
          numberOfComments: 10,
          numberOfLikes: data.likes || 0,
          publicity: data.isPublic ?? false,
          links: data.links || [],
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
