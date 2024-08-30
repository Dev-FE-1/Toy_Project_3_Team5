import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import { fontSize } from '@/constants/font';
import useTagFetch from '@/hooks/useTagFetch';

export const Popular = () => {
  const tags: string[] = ['인기 급상승 동영상', 'Developer', '먹방', 'Vlog'];
  const [clickedBtn, setClickedBtn] = useState(tags[0]);

  const { data: playListCardData } = useTagFetch({
    collectionName: 'playlist',
    tag: clickedBtn,
  });

  const onButtonClick = (tag: string) => () => {
    setClickedBtn(tag);
  };

  return (
    <div css={contentContainerStyle}>
      <div css={tagContainerStyle}>
        {tags.map((tag, index) => (
          <Button
            key={tag}
            label={`#${tag}`}
            onClick={onButtonClick(tag)}
            size='lg'
            color={clickedBtn === tag ? 'primary' : 'gray'}
          />
        ))}
      </div>
      <h1>{clickedBtn}</h1>
      <div css={playlistContainerStyle}>
        {playListCardData &&
          playListCardData.map((playlistCard, index) => (
            <PlaylistCard
              key={index}
              playlistItem={playlistCard}
              size='large'
            />
          ))}
      </div>
    </div>
  );
};

const contentContainerStyle = css`
  display: flex;
  flex-direction: column;

  h1 {
    min-height: 10vh;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: ${fontSize.xxxl};
  }
`;

const tagContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  padding-left: 5px;
  padding-right: 5px;
`;

const playlistContainerStyle = css`
  padding-left: 16px;
`;
