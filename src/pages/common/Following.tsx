import { useState } from 'react';
import { css } from '@emotion/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Plus } from 'lucide-react';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { db, auth } from '@/firebase/firbaseConfig';
import useChannelFetch from '@/hooks/useChannelFetch';
import useFollowingPlaylistFetch from '@/hooks/useFollowingPlaylistFetch';
import { PlayListDataProps } from '@/types/playlistType';

//로그인 로직 완성되면 없애기
export const loginInfo = await signInWithEmailAndPassword(
  auth,
  'test1234@gmail.com',
  'test1234'
);
const loginEmail: string | null = loginInfo.user.email;
const emailPrefix = loginEmail ? loginEmail.split('@')[0] : '';
console.log('로그인id', emailPrefix); //유저정보 콘솔로그
//여기까지 없애기

const Following = () => {
  console.log('emailPrefix', emailPrefix);
  const [selectedChannel, setSelectedChannel] = useState(emailPrefix);

  const channels = useChannelFetch(selectedChannel); // 채널 데이터 가져오기
  const playlists: PlayListDataProps[] =
    useFollowingPlaylistFetch(selectedChannel);
  console.log('가져오는 데이터', playlists);

  const onFollowingChannelCLick = (channelId: string) => {
    // console.log('현재 아이디값', selectedChannel);
    // console.log('누른버튼의값', channelId);
    if (selectedChannel === channelId) {
      setSelectedChannel(emailPrefix);
    } else {
      setSelectedChannel(channelId);
    }
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
