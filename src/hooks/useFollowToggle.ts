import { useCallback, useState, useEffect } from 'react';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

export const useFollowToggle = (channelUserId: string | undefined) => {
  const { userId: currentUserId, fetchUserData } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!channelUserId || !currentUserId) return;

      const currentUserRef = doc(db, 'users', currentUserId);
      const currentUserDoc = await getDoc(currentUserRef);

      if (currentUserDoc.exists()) {
        const userData = currentUserDoc.data();
        setIsFollowing(
          userData.channelFollowing?.includes(channelUserId) || false
        );
      }
    };

    checkFollowStatus();
  }, [channelUserId, currentUserId]);

  const handleFollowToggle = useCallback(async () => {
    if (!channelUserId || !currentUserId || channelUserId === currentUserId)
      return;

    const channelRef = doc(db, 'users', channelUserId);
    const currentUserRef = doc(db, 'users', currentUserId);

    try {
      if (isFollowing) {
        // 팔로우 취소
        await updateDoc(channelRef, {
          channelFollower: arrayRemove(currentUserId),
        });
        await updateDoc(currentUserRef, {
          channelFollowing: arrayRemove(channelUserId),
        });
      } else {
        // 팔로우
        await updateDoc(channelRef, {
          channelFollower: arrayUnion(currentUserId),
        });
        await updateDoc(currentUserRef, {
          channelFollowing: arrayUnion(channelUserId),
        });
      }

      setIsFollowing(!isFollowing);
      await fetchUserData(currentUserId);
    } catch (error) {
      console.error(
        '팔로우 상태를 업데이트하는 동안 오류가 발생했습니다:',
        error
      );
    }
  }, [isFollowing, channelUserId, currentUserId, fetchUserData]);

  return { isFollowing, handleFollowToggle };
};
