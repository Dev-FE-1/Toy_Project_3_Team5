import { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import useChannel from '@/hooks/useChannel';
import useFollowingPlaylistFetch from '@/hooks/useFollowingPlaylist';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useAuthStore } from '@/stores/useAuthStore';

const PAGE_SIZE = 5;

const Following = () => {
  const { userId } = useAuthStore();
  const [selectedChannel, setSelectedChannel] = useState(userId);
  const navigate = useNavigate();

  const followingChannels = useChannel(userId, 'following');
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
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.5,
    }
  );

  const onFollowingChannelClick = (channelId: string) => {
    setSelectedChannel(selectedChannel === channelId ? userId : channelId);
  };

  const onToFollowingListPage = (userId: string) => {
    navigate(`/profile/${userId}/following`);
  };

  return (
    <div css={containerStyle}>
      {followingChannels.length > 0 && (
        <div css={followingHeaderStyle}>
          <div css={followingListStyle}>
            {followingChannels.map((channel) => (
              <div key={channel.id}>
                <button
                  css={followingCoverStyle(selectedChannel === channel.id)}
                  onClick={() => onFollowingChannelClick(channel.id)}
                >
                  <Profile alt='썸네일' src={channel.profileImg} size='md' />
                </button>
                <p css={followingTextStyle}>{channel.channelName}</p>
              </div>
            ))}
          </div>
          <Button
            label='All'
            onClick={() => onToFollowingListPage(userId)}
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
const loadingSpinnerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default Following;
