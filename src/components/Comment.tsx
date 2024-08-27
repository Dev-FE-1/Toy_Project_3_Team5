import { css } from '@emotion/react';
import { EllipsisVertical } from 'lucide-react';
import { fontSize, fontWeight } from '@/constants/font';

interface CommentProps {
  imgUrl: string;
  userName: string;
  content: string;
}

const Comment: React.FC<CommentProps> = ({ imgUrl, userName, content }) => (
  <div css={commentStyles}>
    <img src={imgUrl} alt='프로필이미지' />
    <div css={contentStyles}>
      <span>{userName}</span>
      <span>{content}</span>
    </div>
    <EllipsisVertical />
  </div>
);

const commentStyles = css`
  display: flex;
  gap: 6px;
  align-items: center;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    :hover {
      cursor: pointer;
    }
  }
`;

const contentStyles = css`
  gap: 6px;
  display: flex;
  flex-direction: column;
  width: 100%;

  span {
    font-size: ${fontSize.md};
  }

  span:nth-of-type(1) {
    font-weight: ${fontWeight.semiBold};
  }
`;

export default Comment;
