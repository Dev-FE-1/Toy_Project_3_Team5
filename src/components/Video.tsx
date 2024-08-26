import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';

interface VideoProps {
  imgUrl: string;
  title: string;
  userName: string;
}

const Video = ({ imgUrl, title, userName }: VideoProps) => (
  <div css={VideoContainer}>
    <img css={ThumbnailStyle} src={imgUrl} alt='썸네일' />
    <div css={VideoInfoStyle}>
      <span css={TitleStyle}>{title}</span>
      <span css={UserNameStyle}>{userName}</span>
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
`;
const UserNameStyle = css`
  font-size: ${fontSize.md};
  color: ${colors.gray05};

  &:hover {
    text-decoration: underline;
  }
`;

export default Video;
