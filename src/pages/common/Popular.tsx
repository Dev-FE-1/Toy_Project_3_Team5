import { useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import { HASHTAGS } from '@/constants/hashtag';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useTagFetch from '@/hooks/useTagFetch';
import { useAuthStore } from '@/stores/useAuthStore';

export const Popular = () => {
  const [tags, setTags] = useState<string[]>(['인기 급상승 동영상']);
  const [clickedBtn, setClickedBtn] = useState<string>('인기 급상승 동영상');
  const defaultTags: string[] = ['Developer', '먹방', 'Vlog'];
  const { tags: userTags } = useAuthStore();
  const PAGE_SIZE = 5;

  useEffect(() => {
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
  const playlists = useMemo(
    () => (data ? data.pages.flatMap((page) => page.playlist) : []),
    [data]
  );

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
        {data?.pages.map((page, pageIndex) =>
          page.playlist.map((playlist, index) => (
            <PlaylistCard
              key={`${pageIndex}-${index}`}
              playlistItem={playlist}
              size='large'
            />
          ))
        )}
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
  padding-left: 20px;
`;
const loadingSpinnerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
