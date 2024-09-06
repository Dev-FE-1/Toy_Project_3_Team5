import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistInfo } from '@/api/playlistInfo';
import { getUserInfo } from '@/api/profileInfo';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserProps } from '@/types/api';
import { CommentProps, PlayListDataProps } from '@/types/playlistType';

const INIT_VALUES: DetailInfoProps = {
  playlistInfo: {
    isPublic: true,
    likes: 0,
    links: [],
    ownerChannelName: '로딩중...',
    regDate: new Date().toISOString(),
    tags: [],
    thumbnail: '',
    title: '로딩중...',
    userId: '로딩중...',
  },
  comments: [],
  ownerInfo: {
    channelFollower: [],
    channelFollowing: [],
    channelName: '오너채널명',
    isMyChannel: false,
    profileImg: '',
  },
};

interface DetailInfoProps {
  playlistInfo: PlayListDataProps;
  comments: CommentProps[];
  ownerInfo: UserProps;
}

export const usePlaylistInfo = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { userId } = useAuthStore();

  const [playlistInfo, setPlaylistInfo] = useState<PlayListDataProps>(
    INIT_VALUES.playlistInfo
  );

  const [detailInfo, setDetailInfo] = useState<DetailInfoProps>(INIT_VALUES);

  const [ownerInfo, setOwnerInfo] = useState<UserProps>(INIT_VALUES.ownerInfo);

  const fetchPlaylistInfo = useCallback(async () => {
    const { status, result } = await getPlaylistInfo(Number(playlistId));
    if (status === 'fail') {
      throw new Error('데이터 불러오기에 실패했습니다.');
    }
    if (result) {
      setPlaylistInfo(result);
    }
  }, [playlistId]);

  const fetchOwnerInfo = useCallback(async () => {
    const { status, result } = await getUserInfo(playlistInfo.userId);
    if (status === 'fail') {
      throw new Error('데이터 불러오기에 실패했습니다.');
    }
    if (result) {
      setOwnerInfo(result);
    }
  }, [playlistInfo]);

  useEffect(() => {
    fetchPlaylistInfo();
    fetchOwnerInfo();
  }, []);

  useEffect(() => {
    setDetailInfo({
      ...detailInfo,
      playlistInfo,
      ownerInfo,
    });
  }, [playlistInfo, ownerInfo]);

  return { detailInfo, fetchPlaylistInfo, fetchOwnerInfo };
};
