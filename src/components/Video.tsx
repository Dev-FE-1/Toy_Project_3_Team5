import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { omittedText } from '@/utils/textUtils';

interface VideoProps {
  imgUrl: string;
  title: string;
  userName: string;
  provider: string;
}

const MAX_LENGTH = {
  title: 50,
  name: 20,
};

const ICON: Record<string, string> = {
  youtube: '/src/assets/youtube.png',
  vimeo: '/src/assets/vimeo.png',
  default: '/src/assets/logoIcon.png',
};

const Video = ({ imgUrl, title, userName, provider }: VideoProps) => (
  <div css={VideoContainer}>
    <></>
    <img css={ThumbnailStyle} src={imgUrl} alt='썸네일' />
    <div css={VideoInfoStyle}>
      <span css={TitleStyle}>{omittedText(title, MAX_LENGTH.title)}</span>
      <span css={UserNameStyle}>{omittedText(userName, MAX_LENGTH.name)}</span>
      {provider && (
        <img
          src={ICON[provider.toLowerCase()]}
          css={iconStyle}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = '/src/assets/logoIcon.png';
          }}
        />
      )}
    </div>
  </div>
);

const VideoContainer = css`
  display: flex;
  cursor: pointer;
`;

const iconStyle = css`
  width: 20px;
`;

const ThumbnailStyle = css`
  width: 100px;
  height: 75px;
  max-width: 100px;
  max-height: 75px;
  min-width: 100px;
  min-height: 75px;
  border-radius: 6px;
`;

const VideoInfoStyle = css`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  justify-content: space-around;
`;
const TitleStyle = css`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  color: ${colors.black};
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;
const UserNameStyle = css`
  font-size: ${fontSize.sm};
  color: ${colors.gray05};

  &:hover {
    text-decoration: underline;
  }
`;

export default Video;
