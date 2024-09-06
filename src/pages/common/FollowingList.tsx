import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import { fontSize } from '@/constants/font';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useAuthStore } from '@/stores/useAuthStore';

const FollowingList = () => {
  const { userId } = useParams();
  const { followingList, handleUserMinusClick } = useFollowingList(
    userId || ''
  );
  console.log(useAuthStore());
  return (
    <>
      <div css={rootContainer}>
        <div css={numberingContainer}>총 {followingList.length} 명</div>
        <div css={profileListContainer}>
          {followingList.map((data, index) => (
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
