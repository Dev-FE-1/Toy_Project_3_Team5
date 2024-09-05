import { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import useChannelFetch from '@/hooks/useChannelFetch';
import useFollowingPlaylistFetch from '@/hooks/useFollowingPlaylistFetch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useAuthStore } from '@/stores/useAuthStore';
const PAGE_SIZE = 5;

const Following = () => {
  const { userId } = useAuthStore();
  const [selectedChannel, setSelectedChannel] = useState(userId);

  const channels = useChannelFetch(selectedChannel);
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useFollowingPlaylistFetch(selectedChannel);

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
      root: document.querySelector('.scroll-container'),
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.5,
    }
  );

  const onFollowingChannelClick = (channelId: string) => {
    setSelectedChannel(selectedChannel === channelId ? userId : channelId);
  };

  const followingList = channels.map((channel) => ({
    id: channel.id,
    alt: '썸네일',
    src: channel.profileImg,
    size: 'md' as const,
    name: channel.channelName,
  }));

  return (
    <div css={containerStyle}>
      {followingList.length > 0 && (
        <div css={followingHeaderStyle}>
          <div css={followingListStyle}>
            {followingList.map((following) => (
              <div key={following.id}>
                <button
                  css={followingCoverStyle(selectedChannel === following.id)}
                  onClick={() => onFollowingChannelClick(following.id)}
                >
                  <Profile
                    alt={following.alt}
                    src={following.src}
                    size={following.size}
                  />
                </button>
                <p css={followingTextStyle}>{following.name}</p>
              </div>
            ))}
          </div>
          <Button
            label='All'
            onClick={() => {}}
            IconComponent={Plus}
            color='primary'
            shape='text'
          />
        </div>
      )}
      <div className='scroll-container' css={playlistContainer}>
        {playlists.map((playlist, index) => (
          <PlaylistCard key={index} playlistItem={playlist} size='large' />
        ))}
        {isFetching && playlists.length >= PAGE_SIZE && <LoadingSpinner />}
        <div
          ref={infiniteScrollRef}
          style={{ minHeight: '72px', width: '100%' }}
        ></div>
      </div>
    </div>
  );
};

const containerStyle = css``;

const followingHeaderStyle = css`
  display: flex;
  padding: 10px;
  position: fixed;
  z-index: 10;
  background: ${colors.white};
  width: 430px;
  height: 100px;
`;

const followingListStyle = css`
  flex-grow: 1;
  display: flex;
  gap: 10px;
  overflow: hidden;
`;

const followingCoverStyle = (isSelected: boolean) => css`
  border-radius: 50%;
  border: ${isSelected
    ? `2px solid ${colors.primaryNormal}`
    : `1px solid ${colors.gray03}`};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  background: none;
  cursor: pointer;
`;

const followingTextStyle = css`
  font-size: ${fontSize.xs};
  text-align: center;
  margin-top: 2px;
`;

const playlistContainer = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 100px 20px 20px 20px;
`;

export default Following;
