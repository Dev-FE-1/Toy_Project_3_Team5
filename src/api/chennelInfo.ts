import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

interface ChennelDataProps {
  channelFollower: string[];
  channelFollowing: string[];
  channelName: string;
  profileImg: string;
  isMyChannel: boolean;
}

export const useChennelData = (userId: string | undefined) => {
  const [chennelData, setChennelData] = useState<ChennelDataProps | null>(null);
  const { userId: loggedInUserId } = useAuthStore();
  const { userId: channelOwnerId } = useParams<{ userId: string }>();

  const fetchChennelData = useCallback(() => {
    if (!userId) {
      setChennelData(null);
      return () => {};
    }

    const userDocRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const selectedData: ChennelDataProps = {
            channelFollower: data.channelFollower || [],
            channelFollowing: data.channelFollowing || [],
            channelName: data.channelName || '',
            profileImg: data.profileImg || '',
            isMyChannel: loggedInUserId === channelOwnerId,
          };
          setChennelData(selectedData);
        } else {
          setChennelData(null);
        }
      },
      (error) => {
        console.error(
          '사용자 데이터를 가져오는 동안 오류가 발생했습니다:',
          error
        );
        setChennelData(null);
      }
    );

    return unsubscribe;
  }, [userId, loggedInUserId, channelOwnerId]);

  useEffect(() => {
    const unsubscribe = fetchChennelData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchChennelData]);

  return { chennelData, refetchChennelData: fetchChennelData };
};