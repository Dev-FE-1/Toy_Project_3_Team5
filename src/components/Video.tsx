import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { omittedText } from '@/utils/textUtils';

interface VideoProps {
  imgUrl: string;
  title: string;
  userName: string;
}

const MAXLENGTH = 50;

const Video = ({ imgUrl, title, userName }: VideoProps) => (
  <div css={VideoContainer}>
    <img css={ThumbnailStyle} src={imgUrl} alt='썸네일' />
    <div css={VideoInfoStyle}>
      <span css={TitleStyle}>{omittedText(title, MAXLENGTH)}</span>
      <span css={UserNameStyle}>{omittedText(userName, MAXLENGTH)}</span>
    </div>
  </div>
);
const VideoContainer = css`
  display: flex;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 0px 10px;
`;

const ThumbnailStyle = css`
  width: 200px;
  height: 120px;
  margin-right: 10px;
  border-radius: 10px;
`;

const VideoInfoStyle = css`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`;
const TitleStyle = css`
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.medium};
  color: ${colors.black};
  height: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;
const UserNameStyle = css`
  font-size: ${fontSize.md};
  color: ${colors.gray05};
  height: 50%;

  &:hover {
    text-decoration: underline;
  }
`;

export default Video;
