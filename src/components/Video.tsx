import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { omittedText } from '@/utils/textUtils';

interface VideoProps {
  imgUrl: string;
  title: string;
  userName: string;
}

const MAX_LENGTH = {
  title: 50,
  name: 15,
};

const Video = ({ imgUrl, title, userName }: VideoProps) => (
  <div css={VideoContainer}>
    <></>
    <img css={ThumbnailStyle} src={imgUrl} alt='썸네일' />
    <div css={VideoInfoStyle}>
      <span css={TitleStyle}>{omittedText(title, MAX_LENGTH.title)}</span>
      <span css={UserNameStyle}>{omittedText(userName, MAX_LENGTH.name)}</span>
    </div>
  </div>
);

const VideoContainer = css`
  display: flex;
  cursor: pointer;
  margin-bottom: 10px;
`;

const ThumbnailStyle = css`
  width: 128px;
  height: 72px;
  margin-right: 10px;
  border-radius: 10px;
`;

const VideoInfoStyle = css`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`;
const TitleStyle = css`
  font-size: ${fontSize.md};
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
