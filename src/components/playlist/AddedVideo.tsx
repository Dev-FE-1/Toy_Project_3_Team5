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
      <Video imgUrl={imgUrl} title={title} userName={userName} />
    </div>
  </div>
);

const videoItemStyle = (isActive: boolean) => css`
  display: flex;
  width: calc(100vw - 40px);
  /* max-width: calc(430px - 40px); */
  max-width: 100%;
  margin-bottom: 10px;
  border: 2px solid ${colors.gray02};
  border-radius: 5px;
  padding: 5px;

  ${isActive &&
  css`
    background-color: ${colors.gray02};
    border: 2px solid ${colors.primaryLight};
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
