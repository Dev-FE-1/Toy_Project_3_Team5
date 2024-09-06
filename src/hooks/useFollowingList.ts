import { useState, useEffect } from 'react';
import updateUserFollowingList from '@/api/followingList';
import useChannel from '@/hooks/useChannel';
import useModalStore from '@/stores/useModalStore';

interface FollowingchannelProps {
  src: string;
  alt: 'Profile Image';
  size?: 'sm';
  name: string;
  uid: string;
}

export const useFollowingList = (userId: string) => {
  const [followingList, setFollowingList] = useState<FollowingchannelProps[]>(
    []
  );
  const { openModal } = useModalStore();
  const channels = useChannel(userId); // useChannel 훅 호출

  useEffect(() => {
    setFollowingList(
      channels.map((channel) => ({
        src: channel.profileImg || '',
        alt: 'Profile Image',
        size: 'sm',
        name: channel.id,
        uid: channel.uid || '',
      }))
    );
  }, [channels]);

  const handleUnfollowConfirm = async (uid: string) => {
    try {
      await updateUserFollowingList(userId, uid); // 팔로잉 삭제 API 호출
    } catch (error) {
      console.error('Error during unfollow operation:', error);
    }
  };

  const handleUserMinusClick = (uid: string) => {
    openModal({
      type: 'confirm',
      title: '언팔로우 확인',
      content: '정말로 이 유저를 언팔로우 하시겠습니까?',
      onAction: () => handleUnfollowConfirm(uid),
    });
  };

  return {
    followingList,
    handleUserMinusClick,
    setFollowingList,
  };
};
