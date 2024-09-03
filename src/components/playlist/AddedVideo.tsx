import React from 'react';
import { css } from '@emotion/react';
import { AlignJustify, X } from 'lucide-react';
import IconButton from '@/components/IconButton';
import Video from '@/components/Video';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import { VideoProps } from '@/types/video';
import { omittedText } from '@/utils/textUtils';

export interface AddedLinkProps extends VideoProps {
  videoId: string;
  link: string;
  onRemove: (videoId: string) => void;
  isDragNDrop?: boolean;
  onDragNDrop?: () => void;
}

const AddedVideo: React.FC<AddedLinkProps> = ({
  videoId,
  imgUrl,
  onRemove,
  link,
  title,
  userName,
  isDragNDrop = false,
  onDragNDrop,
}) => (
  <div css={videoItemStyle}>
    {isDragNDrop && onDragNDrop !== undefined && (
      <IconButton
        IconComponent={AlignJustify}
        onClick={onDragNDrop}
        color='gray'
      />
    )}
    <div css={linkInfoStyle}>
      <div css={videoLinkStyle}>
        <p title={link}>{omittedText(link, 40)}</p>
        <IconButton
          IconComponent={X}
          onClick={() => {
            onRemove(videoId);
          }}
        />
      </div>
      <Video imgUrl={imgUrl} title={title} userName={userName} />
    </div>
  </div>
);

const videoItemStyle = css`
  display: flex;
  width: calc(100vw - 40px);
  max-width: calc(430px - 40px);
  margin-bottom: 10px;
  border: 1px solid ${colors.gray02};
  border-radius: 5px;
  padding: 5px;
`;

const videoLinkStyle = css`
  color: ${colors.primaryNormal};
  display: flex;
  align-items: center;

  & p {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    font-size: ${fontSize.sm};
    padding: 10px 0;
  }
`;

const linkInfoStyle = css`
  flex-grow: 1;
`;

export default AddedVideo;
