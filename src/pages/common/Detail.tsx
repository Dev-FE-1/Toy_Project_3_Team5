import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ExternalLink, Heart, ListPlus, X } from 'lucide-react';
import { CommentWithProfileApiProps, removeComment } from '@/api/comment';
import Button from '@/components/Button';
import Comment from '@/components/Comment';
import IconButton from '@/components/IconButton';
import MiniPlaylist from '@/components/MiniPlaylist';
import Modal from '@/components/Modal';
import AddedVideo, { AddedLinkProps } from '@/components/playlist/AddedVideo';
import Profile from '@/components/Profile';
import Toggle from '@/components/Toggle';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import useDetailForm from '@/hooks/useDetailForm';
import { usePlaylistInfo } from '@/hooks/usePlaylistInfo';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { getProfileImg } from '@/utils/profileUtils';
import { convertUnitNumber, omittedText } from '@/utils/textUtils';
import { makeEmbedUrl } from '@/utils/videoUtils';

const MAX_LENGTH = {
  videoTitle: 20,
  playlistTitle: 20,
  description: 100,
  channelName: 10,
};

const COMMENT_PLUS_SIZE = 5;

const Detail = () => {
  const { profileImage, userId: loginId } = useAuthStore();
  const { toastTrigger } = useToast();
  const [currentVideo, setCurrentVideo] = useState<AddedLinkProps>();

  const { values, onChanges, onClicks } = useDetailForm();

  const { detailInfo, videoList, fetchOwnerInfo, fetchCommentInfo } =
    usePlaylistInfo();

  const { playlistInfo, comments, ownerInfo } = detailInfo;
  const [isCommentReload, setIsCommentReload] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<CommentWithProfileApiProps[]>(
    []
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [isFullDesc, setIsFullDesc] = useState<boolean>(false);

  const [commentsPlus, setCommentsPlus] = useState<number>(COMMENT_PLUS_SIZE);
  const onCommentsPlus = () => {
    setCommentsPlus((prev) => prev + COMMENT_PLUS_SIZE);
  };

  const deleteComment = async (docId: string | undefined) => {
    if (docId) {
      const { status } = await removeComment(docId);
      if (status === 'success') {
        toastTrigger('댓글이 삭제되었습니다.');
        setCommentList((prev) =>
          prev.filter((comment) => comment.docId !== docId)
        );
      }
    }
  };

  useEffect(() => {
    fetchOwnerInfo();
  }, [playlistInfo]);

  useEffect(() => {
    if (isCommentReload) {
      setIsCommentReload(false);
      fetchCommentInfo();
    }
  }, [isCommentReload]);

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  useEffect(() => {
    setCurrentVideo(videoList[values.currentVideoIndex]);
  }, [values.currentVideoIndex]);

  useEffect(() => {
    setCurrentVideo(videoList[0]);
  }, [videoList]);

  return (
    <div css={containerStyle}>
      {currentVideo && (
        <div css={currentVideoStyle}>
          <iframe
            css={iframeStyle}
            src={`${makeEmbedUrl(currentVideo.videoId, 'youtube')}`}
            allow='autoplay; picture-in-picture; web-share'
            allowFullScreen
            title={currentVideo.title}
          />
        </div>
      )}

      {currentVideo && (
        <div css={videoTextDivStyle}>
          <div css={videoTitleStyle}>
            {omittedText(currentVideo?.title, MAX_LENGTH.videoTitle)}
          </div>
          <div css={playlistTagStyle}>
            {playlistInfo.tags.map((tag, index) => (
              <div key={index}>{tag}</div>
            ))}
          </div>
        </div>
      )}

      {!!!isOpen && (
        <div css={playlistInfoStyle}>
          <div css={oneLineStyle}>
            <div css={headerDetailStyle}>
              <span className='title'>{playlistInfo.title}</span>
              <span className='counter'>
                {values.currentVideoIndex + 1}/{playlistInfo.links.length}
              </span>
            </div>
            <IconButton
              IconComponent={X}
              onClick={() => {
                setIsOpen(true);
              }}
              color='gray'
            />
          </div>
          <div css={descStyle}>
            {isFullDesc ? (
              <>
                <span>{playlistInfo.description}</span>

                <span
                  className='extraText'
                  onClick={() => {
                    setIsFullDesc(false);
                  }}
                >
                  줄이기
                </span>
              </>
            ) : (
              <>
                <span>
                  {omittedText(
                    playlistInfo.description ?? '',
                    MAX_LENGTH.description
                  )}
                </span>
                {playlistInfo.description &&
                  playlistInfo.description.length > MAX_LENGTH.description && (
                    <span
                      className='extraText'
                      onClick={() => {
                        setIsFullDesc(true);
                      }}
                    >
                      더보기
                    </span>
                  )}
              </>
            )}
          </div>
          <div css={oneLineStyle}>
            <Profile
              alt='이미지'
              src={ownerInfo.profileImg}
              size='sm'
              onClick={() => {
                onClicks.profile(ownerInfo.userId);
              }}
            />
            <div
              css={userInfoTwoLineStyle}
              onClick={() => {
                onClicks.profile(ownerInfo.userId);
              }}
            >
              <span className='channelName'>
                {omittedText(ownerInfo.channelName, MAX_LENGTH.channelName)}
              </span>
              <span className='counter'>
                {convertUnitNumber(ownerInfo.channelFollowing.length, 1)} 팔로워
              </span>
            </div>
            <div css={emptyBoxStyle}></div>
          </div>
          <div css={userInfoStyle}>
            <IconButton
              IconComponent={Heart}
              onClick={() => {}}
              label='5000'
              color='black'
            />
            <IconButton
              IconComponent={ExternalLink}
              onClick={onClicks.copy}
              color='black'
              label='공유'
            />
            <IconButton
              IconComponent={ListPlus}
              onClick={() => {}}
              color='black'
              label='저장'
            />
          </div>
          <div css={oneLineStyle}>
            <Toggle
              enabled={autoPlay}
              setEnabled={setAutoPlay}
              label={{ active: '다음으로 재생될 영상', inactive: '' }}
            />
          </div>
          <div css={videoListInfoStyle(true)}>
            {videoList &&
              videoList.map((video, index) => (
                <AddedVideo
                  key={`video-${index}`}
                  videoId={video.videoId}
                  imgUrl={video.imgUrl}
                  link={video.link}
                  title={video.title}
                  userName={video.userName}
                  isRemovable={false}
                  isLinkView={false}
                  onClick={() => {
                    onClicks.video(index);
                  }}
                  isActive={index === values.currentVideoIndex}
                />
              ))}
          </div>
        </div>
      )}

      <div css={commentContainer}>
        <div css={commentHeader}>
          <span className='title'>댓글</span>
          <span className='counter'>{commentList.length}</span>
        </div>
        <div css={oneLineStyle}>
          <Profile alt='프로필' src={profileImage} size='xs' />
          <input
            css={commentInputStyle}
            placeholder='댓글 추가...'
            value={values.comment}
            onChange={onChanges.comment}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                onClicks.comment();
                setIsCommentReload(true);
              }
            }}
          />
          <Button
            label='작성'
            onClick={() => {
              onClicks.comment();
              setIsCommentReload(true);
            }}
            color='black'
          />
        </div>
        <div css={commentStyle}>
          {commentList &&
            commentList.length > 0 &&
            commentList.slice(0, commentsPlus).map((comment, index) => (
              <Comment
                key={`comment-${index}`}
                content={comment.content}
                imgUrl={getProfileImg(comment.userId)}
                userName={comment.userName}
                showKebabMenu={loginId === comment.userId}
                isEdited={comment.isEdited}
                docId={comment.docId}
                onDelete={deleteComment}
                onClick={() => {
                  onClicks.profile(comment.userId);
                }}
              />
            ))}

          {commentList.length > commentsPlus && (
            <Button
              label='더보기'
              onClick={onCommentsPlus}
              size='lg'
              fullWidth
              color='gray'
            />
          )}
        </div>
      </div>

      {playlistInfo && isOpen && (
        <MiniPlaylist
          isActive={true}
          onClose={() => {
            setIsOpen(false);
          }}
          videoInfo={{
            playlistName: omittedText(
              playlistInfo.title,
              MAX_LENGTH.playlistTitle
            ),
            subject: omittedText(
              currentVideo?.title ?? '',
              MAX_LENGTH.videoTitle
            ),
            thumbnail: currentVideo?.imgUrl,
          }}
        />
      )}
      <Modal />
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
`;

const currentVideoStyle = css`
  width: 430px; // 영상 상단 고정에 필요한 값
  height: 242px; // 영상 상단 고정에 필요한 값
  display: block;
`;

const iframeStyle = css`
  width: 430px;
  height: 242px;
  position: fixed; // 영상 상단 고정
  z-index: 1000;
`;

const videoTextDivStyle = css`
  margin: 10px 20px;
  z-index: 0;
  & > * {
    z-index: 0;
  }
`;

const videoTitleStyle = css`
  padding: 5px 0;
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.extraBold};
`;

const playlistTagStyle = css`
  padding: 5px 0;
  display: flex;
  gap: 5px;
  color: ${colors.primaryNormal};
  font-size: ${fontSize.sm};
`;

const playlistInfoStyle = css`
  display: flex;
  flex-direction: column;
  max-width: 430px;
  border: 1px solid ${colors.gray02};
  border-radius: 10px;
  padding: 10px;
  gap: 5px;
  margin: 10px 20px;
`;

const oneLineStyle = css`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const headerDetailStyle = css`
  flex-grow: 1;
  align-content: center;
  > .title {
    font-size: ${fontSize.md};
    font-weight: ${fontWeight.bold};
  }

  > .counter {
    padding-left: 10px;
    color: ${colors.gray04};
  }
`;

const descStyle = css`
  color: ${colors.gray05};
  font-size: ${fontSize.sm};
  > .extraText {
    padding-left: 5px;
    color: ${colors.gray03};
    cursor: pointer;
    &:hover {
      color: ${colors.primaryLight};
    }
  }
`;

const userInfoTwoLineStyle = css`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  justify-content: space-between;
  cursor: pointer;

  > .channelName {
    font-size: ${fontSize.lg};
  }
  > .counter {
    font-size: ${fontSize.sm};
    color: ${colors.gray05};
  }
`;
const emptyBoxStyle = css`
  flex-grow: 1;
`;

const userInfoStyle = css`
  ${oneLineStyle};

  display: flex;
  justify-content: space-evenly;
  border-top: 1px solid ${colors.gray02};
  border-bottom: 1px solid ${colors.gray02};
`;

const videoListInfoStyle = (isScroll: boolean) => css`
  ${oneLineStyle};
  flex-direction: column;

  ${isScroll &&
  css`
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  `}
`;

const commentContainer = css`
  margin: 20px;
  max-width: 100%;
`;

const commentHeader = css`
  ${oneLineStyle};

  > .title {
    font-weight: ${fontWeight.bold};
  }

  > .counter {
    color: ${colors.gray05};
    padding-left: 5px;
  }
`;

const commentInputStyle = css`
  background-color: ${colors.gray02};
  border: 0;
  border-radius: 5px;
  flex-grow: 1;
  padding: 0 10px;
  margin: 0 10px;
`;

const commentStyle = css`
  & > div {
    margin: 10px 0;
  }
`;

export default Detail;
