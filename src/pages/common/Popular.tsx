import { useState } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import useTagFetch from '@/hooks/useTagFetch';
import { PlayListDataProps } from '@/types/playlistType';

export const Popular = () => {
  const tags: string[] = ['인기 급상승 동영상', 'Developer', '먹방', 'Vlog'];
  const [clickedBtn, setClickedBtn] = useState(tags[0]);

  const onButtonClick = (tag: string) => () => {
    setClickedBtn(tag);
  };
  const playlistCollectionData: PlayListDataProps[] = useTagFetch({
    collectionName: 'playlist',
    tag: clickedBtn,
  });

  return (
    <div css={contentContainerStyle}>
      <div css={headerContainerStyle}>
        <div css={tagContainerStyle}>
          {tags.map((tag, index) => (
            <Button
              key={tag}
              label={`#${tag}`}
              onClick={onButtonClick(tag)}
              size='lg'
              color={clickedBtn === tags[index] ? 'primary' : 'lightGray'}
            ></Button>
          ))}
        </div>
        <div css={titleContainerStyle}>{clickedBtn}</div>
      </div>
      <div css={playlistContainerStyle}>
        {playlistCollectionData &&
          playlistCollectionData.map((playlistCard, index) => (
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
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;
const headerContainerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: fixed;
  z-index: 10;
  background: ${colors.white};
  height: 200px;
  width: 430px;
`;
const tagContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  padding-left: 15px;
  padding-right: 15px;
`;

const titleContainerStyle = css`
  height: 100px;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 20px;
  padding-left: 15px;
  font-size: ${fontSize.xxxl};
`;

const playlistContainerStyle = css`
  padding-top: 200px;
`;
