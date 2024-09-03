import { useState } from 'react';
import { css } from '@emotion/react';

import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { PlayListDataProps } from '@/hooks/usePlaylist';
import { TEST_DATA, TestProfileProps } from '@/mock/following-test';

const Following = () => {
  const getFollowing = () => TEST_DATA.following;
  const getPlaylist = () => TEST_DATA.playlist;
  const navigate = useNavigate();

  const followingList: TestProfileProps[] = getFollowing();
  const playlists: PlayListDataProps[] = getPlaylist();
  const onlistClick = () => {
    navigate(ROUTES.PROFILE_FOLLOWING('123123'));
  };
  return (
    <div css={containerStyle}>
      {followingList && followingList.length > 0 ? (
        <div css={followingHeaderStyle}>
          <div css={followingListStyle}>
            {followingList.map((following) => (
              <div key={following.id}>
                <button
                  css={followingCoverStyle(selectedChannel === following.id)}
                  onClick={() => onFollowingChannelCLick(following.id)}
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
            onClick={onlistClick}
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
    : `1px solid ${colors.gray03}`}; // 클릭 상태에 따른 border 스타일
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

const recommandStyles = css`
  font-size: ${fontSize.xxxl};
  font-weight: ${fontWeight.bold};
  padding: 10px;
  margin-bottom: 10px;
`;

export default Following;
