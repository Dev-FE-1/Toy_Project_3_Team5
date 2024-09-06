import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommentWithProfileApiProps, getPlaylistComment } from '@/api/comment';
import { getPlaylistInfo } from '@/api/playlistInfo';
import { getUserInfo } from '@/api/profileInfo';
import { getVideoInfo } from '@/api/video';
import { AddedLinkProps } from '@/components/playlist/AddedVideo';
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
    profileImg: '',
  },
};

interface DetailInfoProps {
  playlistInfo: PlayListDataProps;
  comments: CommentWithProfileApiProps[];
  ownerInfo: UserProps;
}

export const usePlaylistInfo = () => {
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

  const convertLinkToVideoInfo = useCallback(
    async (link: string) => {
      await getVideoInfo(link).then(({ result }) => {
        if (result) setVideoList((prev) => [...prev, result]);
      });
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
    playlistInfo.links.map((link) => {
      convertLinkToVideoInfo(link);
    });
  }, [playlistInfo]);

  useEffect(() => {
    setDetailInfo({
      ...detailInfo,
      playlistInfo,
      ownerInfo,
      comments: commentList,
    });
  }, [playlistInfo, ownerInfo, commentList]);

  useEffect(() => {}, [detailInfo]);

  return {
    detailInfo,
    videoList,
    fetchPlaylistInfo,
    fetchOwnerInfo,
    fetchCommentInfo,
  };
};
