import { css } from '@emotion/react';
import { signOut } from 'firebase/auth';
import { Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import IconButton from '@/components/IconButton';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { auth } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

const comments = [
  {
    id: 1,
    ply: '플레이리스트: 비오는 날 듣기좋은 PopSong List',
    text: '너무재밌어요! 너무재밌어요! 너무재밌어요!너무재밌어요! 너무재밌어요! 너무재밌어요! ',
  },
  {
    id: 2,
    ply: '플레이리스트: 비오는 날 듣기좋은 PopSong List',
    text: '너무 재밌어요! 다음 플레이리스트는 언제 올라오나요?',
  },
  {
    id: 3,
    ply: '먹방',
    text: '안녕하세요',
  },
];

export const ProfileHome = () => {
  const navigate = useNavigate();
  const {
    userId,
    profileImage,
    channelName,
    likedPlaylist,
    savedPlaylist,
    channelFollower,
    channelFollowing,
    tags,
    clearUser,
  } = useAuthStore();

  const infoData = [
    { count: savedPlaylist.length, label: '플레이리스트' },
    { count: channelFollower.length, label: '팔로워' },
    { count: channelFollowing.length, label: '팔로잉' },
  ];

  const logout = async () => {
    await signOut(auth).then(() => {
      clearUser();
      navigate(ROUTES.ROOT);
    });
  };

  return (
    <div css={containerStyle}>
      <div css={profileContainerStyle}>
        <Profile src={profileImage} alt='프로필 이미지' size='xl' />
        <span css={profileNameStyle}>{channelName}</span>
        <button
          css={profileBtnStyle}
          onClick={() => navigate(ROUTES.PROFILE_MODIFY(userId))}
        >
          프로필 수정
        </button>
        <div css={infoContainerStyle}>
          {infoData.map(({ count, label }) => (
            <div key={label} css={infoStyle}>
              <div>{count}</div>
              <div>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div css={commentContainerStyle}>
        <div css={commentHeaderStyle}>내가 쓴 댓글 30</div>
        <div css={deleteContainerStyle}>
          <button css={allSelectBtnStyle}>전체 선택</button>
          <IconButton
            IconComponent={Trash2}
            onClick={() => {}}
            size='md'
            color='red'
          />
        </div>
        <ul css={commentSelectStyle}>
          {comments.map(({ id, ply, text }) => (
            <li key={id} css={commentStyle}>
              <CheckBox />
              <Profile src={profileImage} alt='프로필 이미지' size='sm' />
              <div css={commentDesStyle}>
                <span>{ply}</span>
                <div>{text}</div>
              </div>
            </li>
          ))}
        </ul>
        <Button
          label='더보기'
          onClick={() => {}}
          size='lg'
          fullWidth
          color='gray'
        />
      </div>
      <div css={logoutStyle} onClick={logout}>
        <IconButton
          IconComponent={LogOut}
          onClick={logout}
          size='md'
          color='gray'
        />
        로그아웃
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const profileContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${colors.gray02};
  margin-bottom: 20px;
`;

const profileNameStyle = css`
  margin: 6px 0;
  font-size: ${fontSize.xl};
  color: ${colors.black};
`;

const profileBtnStyle = css`
  background-color: ${colors.gray06};
  border-radius: 50px;
  font-size: ${fontSize.xs};
  color: ${colors.white};
  border: 1px solid ${colors.gray03};
  padding: 4px 12px;
  margin: 6px 0 20px 0;
`;

const infoContainerStyle = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const infoStyle = css`
  display: flex;
  flex-direction: column;
  width: 112px;
  text-align: center;
  cursor: pointer;

  & > div:first-of-type {
    font-weight: ${fontWeight.semiBold};
    height: 22px;
  }
`;

const commentContainerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const commentHeaderStyle = css`
  font-weight: ${fontWeight.medium};
`;

const deleteContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const allSelectBtnStyle = css`
  background-color: ${colors.white};
  font-size: ${fontSize.sm};
  color: ${colors.gray05};
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid ${colors.gray03};
  cursor: pointer;
`;

const commentSelectStyle = css`
  width: 100%;
  margin-bottom: 12px;
`;

const commentStyle = css`
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: ${fontSize.sm};
  border-bottom: 1.5px solid ${colors.gray02};

  & > *:not(:last-child) {
    margin-right: 12px;
  }

  span {
    color: ${colors.gray05};
    margin-bottom: 6px;
  }
`;

const commentDesStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
  flex: 1;
  word-break: break-word;
`;

const logoutStyle = css`
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  border: none;
  border-top: 1px solid ${colors.gray02};
  font-size: ${fontSize.sm};
  color: ${colors.gray05};
  padding: 14px;
  cursor: pointer;
`;
