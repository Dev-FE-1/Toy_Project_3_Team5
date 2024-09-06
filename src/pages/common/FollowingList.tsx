import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import { fontSize } from '@/constants/font';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const FollowingList = () => {
  const { userId } = useParams();
  const { followingList } = useFollowingList(userId || '');
  const { removeFollowing } = useAuthStore.getState();
  const { openModal } = useModalStore(); // 모달 스토어 가져오기

  const handleUnfollow = async (uid: string) => {
    if (userId) {
      await removeFollowing(userId, uid); // 팔로잉 삭제 함수 호출
    }
  };

  const handleUserMinusClick = (uid: string) => {
    openModal({
      type: 'confirm', // 모달 타입 설정
      title: '언팔로우 확인',
      content: '정말로 이 유저를 언팔로우 하시겠습니까?',
      onAction: () => handleUnfollow(uid), // 확인 버튼 클릭 시 실행할 함수
    });
  };

  return (
    <>
      <div css={rootContainer}>
        <div css={numberingContainer}>
          {followingList.length === 0
            ? '아무도 없습니다.' // 팔로잉 리스트가 비어 있을 경우
            : `총 ${followingList.length} 명`}{' '}
          {/* 팔로잉 리스트가 있을 경우 */}
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
                  onClick={() => handleUserMinusClick(data.uid)} // 삭제 확인 모달 열기
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
