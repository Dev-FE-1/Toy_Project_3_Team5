import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';

export const NotFound = () => {
  const navigate = useNavigate();

  const onBtnClick = (): void => {
    navigate(ROUTES.ROOT);
  };

  return (
    <section css={containerStyles}>
      <img src={'src/assets/404.png'} alt='404 이미지' />
      <h1>페이지를 찾을 수 없습니다.</h1>
      <h3>
        방문하시려는 페이지의 주소가 잘못 입력되었거나, <br />
        페이지의 주소가 변경 혹은 삭제되어 <br />
        요청하신 페이지를 찾을 수 없습니다.
      </h3>
      <Button label='홈으로 이동' onClick={onBtnClick} color='black' />
    </section>
  );
};

const containerStyles = css`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  text-align: center;
  max-width: 430px;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  border-left: 1px solid ${colors.gray02};
  border-right: 1px solid ${colors.gray02};

  img {
    width: 60%;
    height: auto;
  }

  h1 {
    font-size: ${fontSize.xxl};
    font-weight: ${fontWeight.bold};
  }

  h3 {
    font-size: ${fontSize.md};
    color: ${colors.gray04};
    line-height: 2.4rem;
  }
`;
