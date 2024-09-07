import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import { fontSize } from '@/constants/font';
import useList from '@/hooks/useList';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const FollowingList = () => {
  const { userId } = useParams();
  const { list: followingList, setList } = useList(userId || '', 'following');
  const { removeFollowing } = useAuthStore.getState();
  const { openModal } = useModalStore();

  const handleUnfollow = async (uid: string) => {
    if (userId) {
      try {
        await removeFollowing(userId, uid);
        setList((prevList) => prevList.filter((user) => user.uid !== uid));
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    }
  };

  const handleUserMinusClick = (uid: string) => {
    openModal({
      type: 'confirm', // 모달 타입 설정
      title: '언팔로우 확인',
      content: '정말로 이 유저를 언팔로우 하시겠습니까?',
      onAction: () => handleUnfollow(uid),
    });
  };

  return (
    <>
      <div css={rootContainer}>
        <div css={numberingContainer}>
          {followingList.length === 0
            ? '팔로우중인 채널이 없습니다'
            : `총 ${followingList.length} 명`}{' '}
        </div>
        <div css={profileListContainer}>
          {followingList.length > 0 &&
            followingList.map((data, index) => (
              <div key={index} css={profileItem}>
                <span css={profileContainerStyle}>
                  <Profile src={data.src} alt={data.alt} size={data.size} />
                  <span>{data.name}</span>
                </span>
                <button
                  css={userMinusStyle}
                  onClick={() => handleUserMinusClick(data.uid)}
                >
                  <UserMinus css={userMinusStyle} />
                </button>
              </div>
            ))}
        </div>
      </div>
      <Modal />
    </>
  );
};

const rootContainer = css`
  display: flex;
  flex-direction: column;
`;

const numberingContainer = css`
  padding-left: 20px;
  padding-top: 20px;
  font-size: ${fontSize.xs};
`;

const profileListContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 20px;
`;

const profileItem = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const profileContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const userMinusStyle = css`
  margin-right: 10px;
  background: none;
  border: none;
`;

export default FollowingList;