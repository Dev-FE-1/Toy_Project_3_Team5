import { useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { HASHTAGS } from '@/constants/hashtag';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useTagFetch from '@/hooks/useTagFetch';
import { useAuthStore } from '@/stores/useAuthStore';

export const Popular = () => {
  const [tags, setTags] = useState<string[]>(['인기 급상승 동영상']);
  const [clickedBtn, setClickedBtn] = useState<string>('인기 급상승 동영상');
  const defaultTags: string[] = ['Developer', '먹방', 'Vlog'];
  const { tags: userTags, userId } = useAuthStore();
  const PAGE_SIZE = 5;

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      setTags(['인기 급상승 동영상', ...defaultTags]);
    }
    if (userTags.length > 0) {
      const matchedTags = HASHTAGS.filter((tag) =>
        userTags.includes(tag.label)
      );

      if (matchedTags.length > 3) {
        const topTags = [
          '인기 급상승 동영상',
          ...matchedTags.slice(0, 3).map((tag) => tag.label.replace('#', '')),
        ];
        setTags(topTags);
      } else {
        const neededTags = 3 - matchedTags.length;
        const additionalTags = defaultTags.slice(0, neededTags);
        const topTags = [
          '인기 급상승 동영상',
          ...matchedTags.map((tag) => tag.label.replace('#', '')),
          ...additionalTags,
        ];
        setTags(topTags);
      }
    }
  }, [userTags]);

  const onButtonClick = (tag: string) => () => {
    setClickedBtn(tag);
  };

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useTagFetch(clickedBtn);
  const playlists = data?.pages.flatMap((page) => page.playlistsData) || [];

  const infiniteScrollRef = useInfiniteScroll(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching) {
        await fetchNextPage();
      }
    },
    {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.5,
    }
  );

  return (
    <div css={contentContainerStyle}>
      <div css={headerContainerStyle}>
        <div css={tagContainerStyle}>
          {tags.map((tag) => (
            <Button
              key={tag}
              label={`#${tag}`}
              onClick={onButtonClick(tag)}
              size='lg'
              color={clickedBtn === tag ? 'primary' : 'lightGray'}
            />
          ))}
        </div>
        <div css={titleContainerStyle}>#{clickedBtn}</div>
      </div>
      <div css={playlistContainerStyle}>
        {playlists.map((playlistItem) => (
          <PlaylistCard
            key={playlistItem.playlistId}
            playlistItem={playlistItem}
            size='large'
          />
        ))}
        <div css={loadingSpinnerStyle}>
          {isFetching && playlists.length >= PAGE_SIZE && <LoadingSpinner />}
        </div>
        <div
          ref={infiniteScrollRef}
          style={{ minHeight: '72px', width: '100%' }}
        ></div>
      </div>
    </div>
  );
};

const headerHeight = '157px';

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
  width: 430px;
  gap: 20px;
`;

const tagContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
`;

const titleContainerStyle = css`
  align-items: center;
  font-size: ${fontSize.xxl};
  font-weight: ${fontWeight.medium};
`;

const playlistContainerStyle = css`
  padding: calc(${headerHeight} + 20px) 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .css-1yx0w9a-largeCardStyles {
    width: 100%;
  }
`;

const loadingSpinnerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
