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

  // channels가 변경될 때마다 followingList 업데이트
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
  }, [channels]); // channels가 변경될 때마다 followingList 업데이트

  const handleUnfollowConfirm = async (uid: string) => {
    try {
      await updateUserFollowingList(userId, uid);
      // `useChannel` 훅을 다시 호출하여 최신 채널 목록을 가져옵니다.
      // 다음 줄은 채널 목록이 업데이트된 후 상태를 설정합니다.
      // `useChannel` 훅이 반환하는 데이터는 자동으로 업데이트됩니다.
      // 상태 업데이트는 `useEffect` 훅에 의해 자동으로 처리됩니다.
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
  };
};
