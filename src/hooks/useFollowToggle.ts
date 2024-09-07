import { useCallback, useState, useEffect } from 'react';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { useChennelData } from '@/api/chennelInfo';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

interface UserDataProps {
  channelFollower: string[];
  channelFollowing: string[];
  channelName: string;
  profileImg: string;
}

export const useFollowToggle = (channelUserId: string | undefined) => {
  const { userId, fetchUserData } = useAuthStore();
  const { chennelData, refetchChennelData } = useChennelData(channelUserId);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (chennelData && userId) {
      setIsFollowing(chennelData.channelFollower.includes(userId));
    }
  }, [chennelData, userId]);

  const createDefaultUserDoc = (id: string): UserDataProps => ({
    channelFollower: [],
    channelFollowing: [],
    channelName: '',
    profileImg: '',
  });

  const handleFollowToggle = useCallback(async () => {
    if (!userId || !channelUserId || userId === channelUserId) {
      return;
    }

    const channelRef = doc(db, 'users', channelUserId);
    const currentUserRef = doc(db, 'users', userId);

    try {
      const [channelDoc, currentUserDoc] = await Promise.all([
        getDoc(channelRef),
        getDoc(currentUserRef),
      ]);

      if (!channelDoc.exists()) {
        await setDoc(channelRef, createDefaultUserDoc(channelUserId));
      }
      if (!currentUserDoc.exists()) {
        await setDoc(currentUserRef, createDefaultUserDoc(userId));
      }

      if (isFollowing) {
        // 팔로우 취소
        await updateDoc(channelRef, {
          channelFollower: arrayRemove(userId),
        });
        await updateDoc(currentUserRef, {
          channelFollowing: arrayRemove(channelUserId),
        });
      } else {
        // 팔로우
        await updateDoc(channelRef, {
          channelFollower: arrayUnion(userId),
        });
        await updateDoc(currentUserRef, {
          channelFollowing: arrayUnion(channelUserId),
        });
      }

      setIsFollowing(!isFollowing);

      await fetchUserData(userId);
      refetchChennelData();
    } catch (error) {
      console.error(
        '팔로우 상태를 업데이트하는 동안 오류가 발생했습니다:',
        error
      );
    }
  }, [isFollowing, userId, channelUserId, fetchUserData, refetchChennelData]);

  return { isFollowing, handleFollowToggle };
};
