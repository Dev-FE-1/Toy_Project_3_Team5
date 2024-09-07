import { useState, useEffect } from 'react';
import useChannel from '@/hooks/useChannel';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

interface ChannelProps {
  src: string;
  alt: 'Profile Image';
  size?: 'sm';
  name: string;
}

type ListType = 'following' | 'follower';

const useList = (userId: string, listType: ListType) => {
  const [list, setList] = useState<ChannelProps[]>([]);
  const { openModal } = useModalStore();
  const channels = useChannel(userId, listType);
  const { removeFollowing, removeFollower } = useAuthStore.getState();

  useEffect(() => {
    setList(
      channels.map((channel) => ({
        src: channel.profileImg || '',
        alt: 'Profile Image',
        size: 'sm',
        name: channel.id,
      }))
    );
  }, [channels]);

  const handleRemove = async (uid: string) => {
    try {
      if (listType === 'following') {
        await removeFollowing(userId, uid);
      } else if (listType === 'follower') {
        await removeFollower(userId, uid);
      }
      setList((prevList) => prevList.filter((user) => user.name !== uid));
    } catch (error) {
      console.error(`Error removing ${listType}:`, error);
    }
  };

  const handleUserMinusClick = (uid: string) => {
    openModal({
      type: 'confirm',
      title: listType === 'following' ? '언팔로우 확인' : '팔로워 삭제 확인',
      content:
        listType === 'following'
          ? '정말로 이 유저를 언팔로우 하시겠습니까?'
          : '정말로 이 유저를 팔로워에서 삭제하시겠습니까?',
      onAction: () => handleRemove(uid),
    });
  };

  return {
    list,
    handleUserMinusClick,
    setList,
  };
};

export default useList;
