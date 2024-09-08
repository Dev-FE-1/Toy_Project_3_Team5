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
  isLinkView?: boolean;
  link: string;
  isRemovable?: boolean;
  onRemove?: (videoId: string) => void;
  isDragNDrop?: boolean;
  onDragNDrop?: () => void;
  onClick?: () => void;
  isActive?: boolean;
  embedCode?: string;
  provider?: string;
}

const AddedVideo: React.FC<AddedLinkProps> = ({
  videoId,
  imgUrl,
  isRemovable = true,
  onRemove,
  isLinkView = true,
  link,
  title,
  userName,
  isDragNDrop = false,
  onDragNDrop,
  onClick = () => {},
  isActive = false,
  provider = 'default',
}) => (
  <div css={videoItemStyle(isActive)} onClick={onClick}>
    {isDragNDrop && onDragNDrop !== undefined && (
      <IconButton
        IconComponent={AlignJustify}
        onClick={onDragNDrop}
        color='gray'
      />
    )}
    <div css={linkInfoStyle}>
      <div css={videoLinkStyle}>
        {isLinkView && <p title={link}>{omittedText(link, 40)}</p>}
        {isRemovable && onRemove && (
          <IconButton
            IconComponent={X}
            onClick={() => {
              onRemove(videoId);
            }}
          />
        )}
      </div>
      <Video
        imgUrl={imgUrl}
        title={title}
        userName={userName}
        provider={provider}
      />
    </div>
  </div>
);

const videoItemStyle = (isActive: boolean) => css`
  display: flex;
  width: calc(100vw - 40px);
  max-width: 100%;
  padding: 6px;
  border-left: 4px solid rgba(255, 255, 255, 0);

  ${isActive &&
  css`
    background: rgba(63, 132, 243, 0.05);
    border-left: 4px solid ${colors.primaryLight};
  `}
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
