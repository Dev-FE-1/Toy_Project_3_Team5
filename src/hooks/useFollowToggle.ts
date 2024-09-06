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
  uid: string;
}

export const useFollowToggle = (userId: string | undefined) => {
  const { user, fetchUserData } = useAuthStore();
  const { chennelData } = useChennelData(userId);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chennelData && user) {
      setIsFollowing(chennelData.channelFollower.includes(user.uid));
    }
  }, [chennelData, user]);

  const createDefaultUserDoc = (uid: string): UserDataProps => ({
    channelFollower: [],
    channelFollowing: [],
    channelName: '',
    profileImg: '',
    uid,
  });

  const handleFollowToggle = useCallback(async () => {
    if (!user || !userId) {
      setError('User information is missing');
      return;
    }

    setError(null);
    const channelRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', user.uid);

    try {
      const [channelDoc, currentUserDoc] = await Promise.all([
        getDoc(channelRef),
        getDoc(currentUserRef),
      ]);

      if (!channelDoc.exists()) {
        await setDoc(channelRef, createDefaultUserDoc(userId));
      }
      if (!currentUserDoc.exists()) {
        await setDoc(currentUserRef, createDefaultUserDoc(user.uid));
      }

      if (isFollowing) {
        // 팔로우 취소
        await updateDoc(channelRef, {
          channelFollower: arrayRemove(user.uid),
        });
        await updateDoc(currentUserRef, {
          channelFollowing: arrayRemove(userId),
        });
      } else {
        // 팔로우
        await updateDoc(channelRef, {
          channelFollower: arrayUnion(user.uid),
        });
        await updateDoc(currentUserRef, {
          channelFollowing: arrayUnion(userId),
        });
      }

      setIsFollowing(!isFollowing);

      await fetchUserData(user.uid);
    } catch (error) {
      console.error(
        '팔로우 상태를 업데이트하는 동안 오류가 발생했습니다:',
        error
      );
      setError('팔로우 상태를 업데이트하지 못했습니다. 다시 시도해 주세요.');
    }
  }, [isFollowing, user, userId, fetchUserData]);

  return { isFollowing, handleFollowToggle, error };
};
