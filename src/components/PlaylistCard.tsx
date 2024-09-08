import React, { useEffect } from 'react';
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
import { deletePlaylist } from '@/api/playlistInfo';
import IconButton from '@/components/IconButton';
import KebabButton from '@/components/KebabButton';
import Modal from '@/components/Modal';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import usePlaylistActions from '@/hooks/usePlaylistActions';
import useToast from '@/hooks/useToast';
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
  onDelete?: (playlistId: number) => void;
  isPreview?: boolean;
}

const MAXLENGTH = 50;

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlistItem,
  size,
  showAddButton = false,
  showLikeButton = false,
  showLockButton = false,
  showKebabMenu = false,
  onDelete,
  isPreview = false,
}) => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { visibilities, toggleVisibility, setInitialVisibility } =
    useVisibilityStore();
  const { isLiked, isAdded, toggleLike, toggleSave, likes } =
    usePlaylistActions(
      playlistItem.playlistId ? +playlistItem.playlistId : 0,
      playlistItem.likes
    );
  const isPublic = playlistItem.playlistId
    ? visibilities[playlistItem.playlistId]
    : false;

  const onCardClick = (): void => {
    if (isPreview) return;
    const restrictedRoot = /^\/playlist\/[^/]+\/add$/;

    if (restrictedRoot.test(location.pathname)) {
      return;
    }

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
      onAction: async () => {
        if (playlistItem.playlistId) {
          const playlistIdNumber = Number(playlistItem.playlistId);
          if (isNaN(playlistIdNumber)) {
            toastTrigger('올바르지 않은 플레이리스트 ID입니다.', 'fail');
            return;
          }
          const response = await deletePlaylist(playlistIdNumber);
          if (response.status === 'success') {
            toastTrigger('플레이리스트가 삭제되었습니다.', 'success');
            if (onDelete) {
              onDelete(playlistIdNumber);
            }
          } else {
            toastTrigger('플레이리스트 삭제에 실패했습니다.', 'fail');
          }
        } else {
          toastTrigger('플레이리스트 ID가 없습니다.', 'fail');
        }
      },
    });
  };

  const { toastTrigger } = useToast();

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
      <div css={largeCardImgStyles(isPreview)} onClick={onCardClick}>
        <span></span>
        <figure className='img-container'>
          <img
            src={
              playlistItem.thumbnail
                ? playlistItem.thumbnail
                : playlistItem.links[0]
            }
            alt='썸네일 이미지'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = '/src/assets/logoIcon.png';
            }}
          />
        </figure>
      </div>
      <section css={largeInfoStyles(isPreview)}>
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
              onClick={() => {
                if (!!!isPreview) toggleLike();
              }}
              color={isLiked ? 'red' : 'gray'}
              fillColor={isLiked ? 'red' : undefined}
            />
            {likes !== null ? likes : playlistItem.likes}
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
      <div css={smallCardStyles(isPreview)} onClick={onCardClick}>
        <figure className='img-container'>
          <img
            src={
              playlistItem.thumbnail
                ? playlistItem.thumbnail
                : playlistItem.links[0]
            }
            alt='썸네일 이미지'
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = '/src/assets/logoIcon.png';
            }}
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
            onClick={toggleSave}
            color='gray'
          />
        )}
        {showLikeButton && (
          <IconButton
            IconComponent={Heart}
            onClick={toggleLike}
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

const largeCardImgStyles = (isPreview = false) => css`
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
    ${!!!isPreview &&
    css`
      :hover {
        cursor: pointer;
      }
    `}

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const largeInfoStyles = (isPreview = false) => css`
  gap: 6px;
  flex-direction: column;
  display: flex;
  padding: 0 10px;
  .title {
    font-size: ${fontSize.md};
    font-weight: ${fontWeight.medium};
    ${!!!isPreview &&
    css`
      :hover {
        cursor: pointer;
      }
    `}
  }
  .username {
    color: ${colors.gray05};
    font-size: ${fontSize.sm};
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    font-size: ${fontSize.md};
    color: ${colors.primaryLight};
    font-size: ${fontSize.sm};
  }
  .icons-container {
    color: ${colors.gray05};
    display: flex;
    align-items: center;
    gap: 8px;
    .icon {
      display: flex;
      align-items: center;
      font-size: ${fontSize.sm};
      gap: 2px;
      button {
        padding: 0;
      }
      svg {
        width: 22px;
        height: 22px;
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

const smallCardStyles = (isPreview = false) => css`
  display: flex;
  gap: 10px;

  ${!!!isPreview &&
  css`
    :hover {
      cursor: pointer;
    }
  `}

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
    flex-wrap: wrap;
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
