import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ExternalLink, Heart, ListPlus, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getVideoInfo } from '@/api/video';
import Button from '@/components/Button';
import Comment from '@/components/Comment';
import IconButton from '@/components/IconButton';
import MiniPlaylist from '@/components/MiniPlaylist';
import { AddedLinkProps } from '@/components/playlist/AddedVideo';
import Profile from '@/components/Profile';
import Toggle from '@/components/Toggle';
import Video from '@/components/Video';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { PlayListDataProps } from '@/types/playlistType';
import { omittedText } from '@/utils/textUtils';
import { makeEmbedUrl } from '@/utils/videoUtils';

/**
 * 1. 현재 playlistInfo 데이터 호출
 * 2. ui에 데이터 출력
 *  2.1. 자동재생은 지원하지 않음.
 */

const fetchTestData = {
  likes: 0,
  regDate: '2024-09-04T03:02:17.304Z',
  userId: 'kimisadev27',
  tags: ['#윤하', '#데뷔20주년', '#태양물고기'],
  isPublic: true,
  title: '윤하노래 모음',
  description:
    '유튜브에 윤하 검색해서 나오는 영상 5개 유튜브에 윤하 검색해서 나오는 영상 5개 유튜브에 윤하 검색해서 나오는 영상 5개 유튜브에 윤하 검색해서 나오는 영상 5개 유튜브에 윤하 검색해서 나오는 영상 5개 유튜브에 윤하 검색해서 나오는 영상 5개 유튜브에 윤하 검색해서 나오는 영상 5개 ',
  ownerChannelName: 'dj킴믹스',
  thumbnail:
    'https://firebasestorage.googleapis.com/v0/b/tpj3test.appspot.com/o/playlist%2F55%2Fthumbnail.png?alt=media&token=8d1388c8-97e5-4403-8c7c-85985631ac45',
  links: [
    'https://www.youtube.com/watch?v=ECD3nPW0WL8&ab_channel=%ED%8D%BC%EC%8A%A4%EB%84%90Personal',
    'https://www.youtube.com/watch?v=ehX7MAhc5iA&pp=ygUG7Jyk7ZWY',
    'https://www.youtube.com/watch?v=j1uXcHwLhHM&list=RDEMbm5uPcQwbWpV_Z02LESnXQ&start_radio=1',
    'https://www.youtube.com/watch?v=kZEucEyXSQE&t=5s&pp=ygUG7Jyk7ZWY',
    'https://www.youtube.com/watch?v=rVuq_24eEMs&pp=ygUG7Jyk7ZWY',
  ],
};

const test = {
  url: 'https://www.youtube.com/watch?v=ehX7MAhc5iA',
  version: '1.0',
  thumbnail_height: 360,
  provider_name: 'YouTube',
  width: 200,
  thumbnail_width: 480,
  title: '윤하(YOUNHA) - 태양물고기 M/V',
  author_name: 'YOUNHA OFFICIAL',
  thumbnail_url: 'https://i.ytimg.com/vi/ehX7MAhc5iA/hqdefault.jpg',
  author_url: 'https://www.youtube.com/@YOUNHAOFFICIAL',
  html: '<iframe src="https://www.youtube.com/embed/ehX7MAhc5iA?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="윤하(YOUNHA) - 태양물고기 M/V"></iframe>',
  height: 113,
  type: 'video',
  provider_url: 'https://www.youtube.com/',
};

const MAX_LENGTH = {
  videoTitle: 20,
  playlistTitle: 20,
  description: 100,
};

const Detail = () => {
  const playlistId = useParams<{ playlistId: string }>();

  const playlistInfo: PlayListDataProps = fetchTestData;
  const [currentVideo, setCurrentVideo] = useState<AddedLinkProps>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [isFullDesc, setIsFullDesc] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { result } = await getVideoInfo(playlistInfo.links[0]);
      if (!!!result) return;
      setCurrentVideo(result);
      // const embedCode = makeEmbedUrl(result.videoId, 'youtube');
      // setEmbedLink(embedCode);
    })();
  }, []);

  return (
    <div css={containerStyle}>
      <h1>디테일페이지</h1>
      {currentVideo && playlistInfo && (
        <div css={currentVideoStyle}>
          <iframe
            css={iframeStyle}
            src={`${makeEmbedUrl(currentVideo.videoId, 'youtube')}`}
            allow='autoplay; picture-in-picture; web-share'
            allowFullScreen
            title={currentVideo.title}
          />
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
        </div>
      )}

      {!!!isOpen && (
        <div css={playlistInfoStyle}>
          <div css={oneLineStyle}>
            <div css={headerDetailStyle}>
              <span className='title'>{playlistInfo.title}</span>
              <span className='counter'>
                {1}/{playlistInfo.links.length}
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
            <Profile alt='이미지' src={''} size='sm' />
            <div
              css={css`
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                padding: 0 10px;
              `}
            >
              <span>여행자</span>
              <span>50 팔로워</span>
            </div>
            <Button
              label='팔로우'
              onClick={() => {}}
              color='black'
              shape='round'
            />
          </div>
          <div
            css={css`
              display: flex;
              justify-content: space-evenly;
              border-top: 1px solid ${colors.gray02};
              border-bottom: 1px solid ${colors.gray02};
            `}
          >
            <IconButton
              IconComponent={Heart}
              onClick={() => {}}
              label='5000'
              color='black'
            />
            <IconButton
              IconComponent={ExternalLink}
              onClick={() => {}}
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
          <div>
            <Toggle
              enabled={autoPlay}
              setEnabled={setAutoPlay}
              label={{ active: '다음으로 재생될 영상', inactive: '' }}
            />
          </div>
          <div>
            <Video imgUrl={''} title='프라하~' userName='asiunvsidjv(닉네임)' />
            <Video
              imgUrl={''}
              title='영상제목입니다.'
              userName='asiunvsidjv(닉네임)'
            />
          </div>
        </div>
      )}

      <div
        css={css`
          margin: 10px 0;
          max-width: 430px;
        `}
      >
        <h3>댓글 22</h3>
        <div
          css={css`
            display: flex;
            gap: 10px;
            margin: 10px 0;
          `}
        >
          <Profile alt='프로필' src={''} size='xs' />
          <input
            css={css`
              background-color: ${colors.gray02};
              border: 0;
              border-radius: 5px;
              /* height: inherit; */
              flex-grow: 1;
              padding: 0 10px;
            `}
            placeholder='댓글 추가...'
          />
        </div>
        <div
          css={css`
            & > div {
              margin: 10px 0;
            }
          `}
        >
          <Comment
            content='너무 재밌어요!너무 재밌어요!너무 재밌어요!너무 재밌어요!'
            imgUrl={''}
            userName='dev.meryoung'
          />
          <Comment
            content='너무 재밌어요!너무 재밌어요!너무 재밌어요!너무 재밌어요!'
            imgUrl={''}
            userName='닉네임'
          />
          <Comment
            content='너무 재밌어요!너무 재밌어요!너무 재밌어요!너무 재밌어요!'
            imgUrl={''}
            userName='닉네임2'
          />
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
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
`;

const currentVideoStyle = css``;

const iframeStyle = css`
  width: 430px;
  height: 242px;
`;

const videoTextDivStyle = css`
  padding: 10px 20px;
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
  margin: 10px;
`;

const oneLineStyle = css`
  display: flex;
  flex-direction: row;
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

export default Detail;
