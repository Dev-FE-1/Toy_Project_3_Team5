import { useState } from 'react';
import { css } from '@emotion/react';
import { Heart, LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import IconButton from '@/components/IconButton';
import KebabButton from '@/components/KebabButton';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import { PlayListDataProps } from '@/hooks/usePlaylist';
import { omittedText } from '@/utils/textUtils';

interface SmallPlaylistCardProps {
  playlistItem: PlayListDataProps;
}

const MAXLENGTH = 50;

const SmallPlaylistCard: React.FC<SmallPlaylistCardProps> = ({
  playlistItem,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [islocked, setIslocked] = useState(false);

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

  return (
    <article css={ContainerStyles}>
      <div css={cardStyles}>
        <figure className='img-container'>
          <img src={playlistItem.links[0]} alt='썸네일 이미지' />
        </figure>
        <section css={infoStyles}>
          <h2 className='title'>
            {omittedText(playlistItem.title, MAXLENGTH)}
          </h2>
          <p className='username'>
            {playlistItem.userName} · 트랙 {playlistItem.links.length}개
          </p>
          <p className='tags'>{playlistItem.tags}</p>
        </section>
      </div>
      <div css={btnStyles}>
        <IconButton
          IconComponent={Heart}
          onClick={() => {
            setIsLiked(!isLiked);
          }}
          color={isLiked ? 'red' : 'gray'}
          fillColor={isLiked ? 'red' : undefined}
        />
        <IconButton
          IconComponent={islocked ? LockKeyhole : LockKeyholeOpen}
          onClick={() => {
            setIslocked(!islocked);
          }}
          color='gray'
        />
        <KebabButton menuItems={menuItems} />
      </div>
    </article>
  );
};

const ContainerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const cardStyles = css`
  display: flex;
  gap: 10px;
  :hover {
    cursor: pointer;
  }

  .img-container {
    width: 72px;
    height: 72px;
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

const infoStyles = css`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .title {
    font-size: ${fontSize.xl};
  }
  .username {
    color: ${colors.gray05};
  }
  .tags {
    color: ${colors.primaryLight};
  }
`;

const btnStyles = css`
  display: flex;
  gap: 8px;
  color: ${colors.gray05};
`;

export default SmallPlaylistCard;
