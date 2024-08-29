import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { PlayListDataProps } from '@/hooks/usePlaylist';
import { TEST_DATA, TestProfileProps } from '@/mock/following-test';

const Following = () => {
  const getFollowing = () => TEST_DATA.following;
  const getPlaylist = () => TEST_DATA.playlist;

  const followingList: TestProfileProps[] = getFollowing();
  const playlists: PlayListDataProps[] = getPlaylist();

  return (
    <div css={containerStyle}>
      {followingList && followingList.length > 0 ? (
        <div css={followingHeaderStyle}>
          <div css={followingListStyle}>
            {followingList.map((following, index) => (
              <div key={index}>
                <div css={followingCoverStyle}>
                  <Profile
                    alt={following.alt}
                    src={following.src}
                    size={following.size}
                  />
                </div>
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
      ) : (
        <div>
          <p css={recommandStyles}>추천 플레이리스트</p>
        </div>
      )}
      {playlists && playlists.length > 0 && (
        <div css={playlistContainer}>
          {playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlistItem={playlist} size='large' />
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = css``;

const followingHeaderStyle = css`
  display: flex;
  padding: 10px;
`;

const followingListStyle = css`
  flex-grow: 1;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const followingCoverStyle = css`
  border-radius: 100%;
  border: 1px solid ${colors.gray03};
  height: 50px;

  & img {
    transform: scale(0.9);
    border-radius: 100%;
  }
`;

const followingTextStyle = css`
  font-size: ${fontSize.xs};
  text-align: center;
  margin-top: 2px;
`;

const playlistContainer = css`
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 64px - 64px - 80px); // header, footer, main padding-top
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const recommandStyles = css`
  font-size: ${fontSize.xxxl};
  font-weight: ${fontWeight.bold};
  padding: 10px;
  margin-bottom: 10px;
`;

export default Following;
