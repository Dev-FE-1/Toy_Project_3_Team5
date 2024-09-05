import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  Heart,
  MessageSquareMore,
  LockKeyhole,
  LockKeyholeOpen,
  ListX,
  ListPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@/components/IconButton';
import KebabButton from '@/components/KebabButton';
import Modal from '@/components/Modal';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { PlayListDataProps } from '@/types/playlistType';
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
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { visibilities, toggleVisibility, setInitialVisibility } =
    useVisibilityStore();
  useVisibilityStore();
  const isPublic = playlistItem.playlistId
    ? visibilities[playlistItem.playlistId]
    : false;

  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const onCardClick = (): void => {
    navigate(ROUTES.DETAIL(playlistItem.playlistId));
  };

  const onEditBtnClick = (): void => {
    navigate(ROUTES.PLAYLIST_MODIFY(playlistItem.playlistId));
  };

  const onDeleteBtnClick = () => {
    openModal({
      type: 'delete',
      title: '플레이리스트 삭제',
      content: `'${playlistItem.description}'을 삭제하시겠습니까?`,
      onAction: () => {
        ('');
      },
    });
  };

  const { toastTrigger } = useToast();
  const { user } = useAuthStore();

  const onClickHeart = () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.');
    } else {
      setIsLiked(!isLiked);
    }
  };

  const menuItems = [
    {
      label: '수정',
      onClick: onEditBtnClick,
    },
    {
      label: '삭제',
      onClick: onDeleteBtnClick,
    },
  ];

  useEffect(() => {
    if (playlistItem.playlistId) {
      setInitialVisibility(playlistItem.playlistId, playlistItem.isPublic);
    }
  }, [playlistItem.playlistId, playlistItem.isPublic, setInitialVisibility]);

  const handleToggleVisibility = () => {
    if (playlistItem.playlistId) {
      toggleVisibility(playlistItem.playlistId);
    }
  };

  const renderLargeCard = () => (
    <article css={largeCardStyles}>
      <div css={largeCardImgStyles} onClick={onCardClick}>
        <span></span>
        <figure className='img-container'>
          <img
            src={
              playlistItem.thumbnail
                ? playlistItem.thumbnail
                : playlistItem.links[0]
            }
            alt='썸네일 이미지'
          />
        </figure>
      </div>
      <section css={largeInfoStyles}>
        <h2 className='title' onClick={onCardClick}>
          {omittedText(playlistItem.title, MAXLENGTH)}
        </h2>
        <p className='username'>
          {playlistItem.ownerChannelName} · 트랙 {playlistItem.links.length}개
        </p>
        <ul className='tags'>
          {playlistItem.tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
        <div className='icons-container'>
          <div className='icon'>
            <IconButton
              IconComponent={Heart}
              onClick={onClickHeart}
              color={isLiked ? 'red' : 'gray'}
              fillColor={isLiked ? 'red' : undefined}
            />
            {playlistItem.likes}
          </div>
          <div className='icon'>
            <MessageSquareMore />
            {playlistItem.commentCount}
          </div>
        </div>
      </section>
    </article>
  );

  const renderSmallCard = () => (
    <article css={smallContainerStyles}>
      <div css={smallCardStyles} onClick={onCardClick}>
        <figure className='img-container'>
          <img
            src={
              playlistItem.thumbnail
                ? playlistItem.thumbnail
                : playlistItem.links[0]
            }
            alt='썸네일 이미지'
          />
        </figure>
        <section css={smallInfoStyles}>
          <h2 className='title'>
            {omittedText(playlistItem.title, MAXLENGTH)}
          </h2>
          <p className='username'>
            {playlistItem.ownerChannelName} · 트랙 {playlistItem.links.length}개
            · 댓글 {playlistItem.commentCount}개
          </p>
          <ul className='tags'>
            {playlistItem.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
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
            onClick={onClickHeart}
            color={isLiked ? 'red' : 'gray'}
            fillColor={isLiked ? 'red' : undefined}
          />
        )}
        {showLockButton && (
          <IconButton
            IconComponent={isPublic ? LockKeyholeOpen : LockKeyhole}
            onClick={handleToggleVisibility}
            color='gray'
          />
        )}
        {showKebabMenu && <KebabButton menuItems={menuItems} />}
      </div>
      <Modal />
    </article>
  );

  return <>{size === 'large' ? renderLargeCard() : renderSmallCard()}</>;
};

const smallImgSize = '72px';

const largeCardStyles = css`
  gap: 10px;
  flex-direction: column;
  display: flex;
`;

const largeCardImgStyles = css`
  position: relative;
  height: 210px;
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
    height: 200px;
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
    font-size: ${fontSize.lg};
    :hover {
      cursor: pointer;
    }
  }
  .username {
    color: ${colors.gray05};
  }
  .tags {
    display: flex;
    gap: 4px;
    font-size: ${fontSize.md};
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
    display: flex;
    gap: 4px;
    font-size: ${fontSize.sm};
    color: ${colors.primaryLight};
  }
`;

const smallBtnStyles = css`
  display: flex;
  color: ${colors.gray05};
`;

export default PlaylistCard;
