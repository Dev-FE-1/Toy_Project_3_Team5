import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommentWithProfileApiProps, getPlaylistComment } from '@/api/comment';
import { getPlaylistInfo } from '@/api/playlistInfo';
import { getUserInfo } from '@/api/profileInfo';
import { getVideoInfo } from '@/api/video';
import { AddedLinkProps } from '@/components/playlist/AddedVideo';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserProps } from '@/types/api';
import { PlayListDataProps } from '@/types/playlistType';

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
    profileImg: '/src/assets/profile_default.png',
    userId: '',
  },
};

interface DetailInfoProps {
  playlistInfo: PlayListDataProps;
  comments: CommentWithProfileApiProps[];
  ownerInfo: UserProps;
}

export const usePlaylistInfo = () => {
  const { userId: loginId } = useAuthStore();
  const { playlistId } = useParams<{ playlistId: string }>();

  const [detailInfo, setDetailInfo] = useState<DetailInfoProps>(INIT_VALUES);

  const [playlistInfo, setPlaylistInfo] = useState<PlayListDataProps>(
    INIT_VALUES.playlistInfo
  );
  const [videoList, setVideoList] = useState<AddedLinkProps[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<UserProps>(INIT_VALUES.ownerInfo);
  const [commentList, setCommentList] = useState<CommentWithProfileApiProps[]>(
    INIT_VALUES.comments
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setOwnerInfo({
        ...result,
        userId: playlistInfo.userId,
        isMyChannel: playlistInfo.userId === loginId,
      });
    }
  }, [playlistInfo]);

  const convertLinkToVideoInfo = useCallback(
    async (links: string[]) => {
      const tempList: AddedLinkProps[] = new Array(links.length);
      await Promise.all(
        links.map(async (link, index) => {
          const { result } = await getVideoInfo(link);
          if (result) tempList[index] = result;
        })
      );
      setVideoList(tempList);
    },
    [playlistInfo]
  );

  const fetchCommentInfo = useCallback(async () => {
    const { status, result } = await getPlaylistComment(Number(playlistId));
    if (status === 'fail') {
      throw new Error('데이터 불러오기에 실패했습니다.');
    }
    if (result) {
      setCommentList(result);
    }
  }, [playlistInfo]);

  useEffect(() => {
    fetchPlaylistInfo();
    fetchOwnerInfo();
    fetchCommentInfo();
  }, []);

  useEffect(() => {
    convertLinkToVideoInfo(playlistInfo.links);
  }, [playlistInfo]);

  useEffect(() => {
    setIsLoading(
      playlistInfo !== INIT_VALUES.playlistInfo &&
        ownerInfo !== INIT_VALUES.ownerInfo &&
        commentList !== INIT_VALUES.comments
    );

    setDetailInfo({
      ...detailInfo,
      playlistInfo,
      ownerInfo,
      comments: commentList,
    });
  }, [playlistInfo, ownerInfo, commentList]);

  return {
    detailInfo,
    videoList,
    isLoading,
    fetchPlaylistInfo,
    fetchOwnerInfo,
    fetchCommentInfo,
  };
};
