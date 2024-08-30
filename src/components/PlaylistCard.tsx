import React, { useState } from 'react';
import { css } from '@emotion/react';
import {
  Heart,
  MessageSquareMore,
  LockKeyhole,
  LockKeyholeOpen,
  ListX,
  ListPlus,
} from 'lucide-react';
import IconButton from '@/components/IconButton';
import KebabButton from '@/components/KebabButton';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import { PlayListDataProps } from '@/hooks/usePlaylist';
import { omittedText } from '@/utils/textUtils';

type CardSize = 'large' | 'small';

interface PlaylistCardProps {
  playlistItem: PlayListDataProps;
  size: CardSize;
  showAddButton?: boolean;
  showLikeButton?: boolean;
  showLockButton?: boolean;
  showKebabMenu?: boolean;
}

const MAXLENGTH = 50;

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlistItem,
  size,
  showAddButton = false,
  showLikeButton = false,
  showLockButton = false,
  showKebabMenu = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const menuItems = [
    {
      label: '수정',
      onClick: () => '',
    },
    {
      label: '삭제',
      onClick: () => '',
    },
  ];

  const renderLargeCard = () => (
    <article css={largeCardStyles}>
      <div css={largeCardImgStyles}>
        <span></span>
        <figure className='img-container'>
          <img src={playlistItem.links[0]} alt='썸네일 이미지' />
        </figure>
      </div>
      <section css={largeInfoStyles}>
        <h2 className='title'>{omittedText(playlistItem.title, MAXLENGTH)}</h2>
        <p className='username'>
          {playlistItem.userName} · 트랙 {playlistItem.links.length}개
        </p>
        <p className='tags'>{playlistItem.tags}</p>
        <div className='icons-container'>
          <div className='icon'>
            <IconButton
              IconComponent={Heart}
              onClick={() => setIsLiked(!isLiked)}
              color={isLiked ? 'red' : 'gray'}
              fillColor={isLiked ? 'red' : undefined}
            />
            {playlistItem.numberOfLikes}
          </div>
          <div className='icon'>
            <MessageSquareMore />
            {playlistItem.numberOfComments}
          </div>
        </div>
      </section>
    </article>
  );

  const renderSmallCard = () => (
    <article css={smallContainerStyles}>
      <div css={smallCardStyles}>
        <figure className='img-container'>
          <img src={playlistItem.links[0]} alt='썸네일 이미지' />
        </figure>
        <section css={smallInfoStyles}>
          <h2 className='title'>
            {omittedText(playlistItem.title, MAXLENGTH)}
          </h2>
          <p className='username'>
            {playlistItem.userName} · 트랙 {playlistItem.links.length}개
          </p>
          <p className='tags'>{playlistItem.tags}</p>
        </section>
      </div>
      <div css={smallBtnStyles}>
        {showAddButton && (
          <IconButton
            IconComponent={isAdded ? ListX : ListPlus}
            onClick={() => setIsAdded(!isAdded)}
            color='gray'
          />
        )}
        {showLikeButton && (
          <IconButton
            IconComponent={Heart}
            onClick={() => setIsLiked(!isLiked)}
            color={isLiked ? 'red' : 'gray'}
            fillColor={isLiked ? 'red' : undefined}
          />
        )}
        {showLockButton && (
          <IconButton
            IconComponent={isLocked ? LockKeyhole : LockKeyholeOpen}
            onClick={() => setIsLocked(!isLocked)}
            color='gray'
          />
        )}
        {showKebabMenu && <KebabButton menuItems={menuItems} />}
      </div>
    </article>
  );

  return size === 'large' ? renderLargeCard() : renderSmallCard();
};

const smallImgSize = '72px';

const largeCardStyles = css`
  gap: 8px;
  flex-direction: column;
  display: flex;
`;

const largeCardImgStyles = css`
  position: relative;
  height: 230px;
  max-width: 390px;
  align-items: center;
  display: flex;
  flex-direction: column;

  span {
    width: 90%;
    height: 200px;
    background-color: ${colors.gray04};
    display: block;
    border-radius: 12px;
  }
  .img-container {
    position: absolute;
    width: 100%;
    top: 8px;
    height: 220px;
    border-radius: 10px;
    border: 1px solid ${colors.white};
    overflow: hidden;
    :hover {
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const largeInfoStyles = css`
  gap: 6px;
  flex-direction: column;
  display: flex;
  padding: 0 10px;
  .title {
    font-size: ${fontSize.xl};
  }
  .username {
    color: ${colors.gray05};
  }
  .tags {
    color: ${colors.primaryLight};
  }
  .icons-container {
    color: ${colors.gray05};
    display: flex;
    align-items: center;
    gap: 12px;
    .icon {
      display: flex;
      align-items: center;
      gap: 4px;
      button {
        padding: 0;
      }
    }
  }
`;

const smallContainerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const smallCardStyles = css`
  display: flex;
  gap: 10px;
  :hover {
    cursor: pointer;
  }

  .img-container {
    width: ${smallImgSize};
    min-width: ${smallImgSize};
    height: ${smallImgSize};
    min-height: ${smallImgSize};
    overflow: hidden;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    background-color: ${colors.gray05};

    img {
      object-fit: cover;
    }
  }
`;

const smallInfoStyles = css`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .title {
    font-size: ${fontSize.md};
  }
  .username {
    color: ${colors.gray05};
  }
  .tags {
    color: ${colors.primaryLight};
  }
`;

const smallBtnStyles = css`
  display: flex;
  color: ${colors.gray05};
`;

export default PlaylistCard;
