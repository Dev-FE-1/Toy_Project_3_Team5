import { useState } from 'react';
import { css } from '@emotion/react';
import { Heart, MessageSquareMore } from 'lucide-react';
import IconButton from '@/components/IconButton';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import { PlayListDataProps } from '@/hooks/usePlaylist';
import { omittedText } from '@/utils/textUtils';

interface LargePlaylistCardProps {
  playlistItem: PlayListDataProps;
}

const MAXLENGTH = 50;

const LargePlaylistCard: React.FC<LargePlaylistCardProps> = ({
  playlistItem,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <article css={cardStyles}>
      <div css={cardImgStyles}>
        <span></span>
        <figure className='img-container'>
          <img src={playlistItem.links[0]} alt='썸네일 이미지' />
        </figure>
      </div>
      <section css={infoStyles}>
        <h2 className='title'>{omittedText(playlistItem.title, MAXLENGTH)}</h2>
        <p className='username'>
          {playlistItem.userName} · 트랙 {playlistItem.links.length}개
        </p>
        <p className='tags'>{playlistItem.tags}</p>
        <div className='icons-container'>
          <div className='icon'>
            <IconButton
              IconComponent={Heart}
              onClick={() => {
                setIsLiked(!isLiked);
              }}
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
};

const cardStyles = css`
  gap: 8px;
  flex-direction: column;
  display: flex;
`;

const cardImgStyles = css`
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

const infoStyles = css`
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

export default LargePlaylistCard;
