import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import google from '@/assets/google_icon.svg';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import Logo from '@/components/Logo';
import Toggle from '@/components/Toggle';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';

export const SignIn = () => {
  const [a, seta] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSignUpClick = (): void => {
    navigate(ROUTES.SIGN_UP);
  };

  const validatePassword = (value: string) =>
    value.length >= 6 ? '' : '비밀번호를 확인해주세요';

  return (
    <div css={containerStyle}>
      <div style={{ marginBottom: '20px' }}>
        <Logo logoWidth={180} clickable={false} />
      </div>
      <InputBox label='아이디' placeholder='아이디' />
      <InputBox
        label='비밀번호'
        placeholder='비밀번호'
        validate={validatePassword}
        isPassword
      />
      <div css={toggleStyle}>
        <Toggle
          enabled={a}
          setEnabled={seta}
          label={{ active: '로그인 정보 기억하기', inactive: '' }}
        />
      </div>
      <div css={loginBtnStyle}>
        <Button label='로그인' onClick={() => {}} size='lg' fullWidth={true} />
        <div css={lineStyle}></div>
        <Button
          label='또는 구글로 로그인'
          onClick={() => {}}
          size='lg'
          color='black'
          IconComponent={google}
          fullWidth={true}
        />
      </div>
      <div css={signUpMessageStyle}>
        계정이 없으신가요?{' '}
        <span onClick={onSignUpClick} css={signUpStyle}>
          회원가입하기
        </span>
      </div>
    </div>
  );
};

const containerStyle = css`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const toggleStyle = css`
  width: 390px;
  height: 20px;
  margin: 6px 0 14px 0;
  font-size: ${fontSize.sm};
`;

const loginBtnStyle = css`
  width: 390px;
  margin-bottom: 10px;
`;

const lineStyle = css`
  width: 390px;
  height: 0.5px;
  background-color: ${colors.gray02};
  margin: 20px 0;
`;

const signUpMessageStyle = css`
  font-size: ${fontSize.sm};
`;

const signUpStyle = css`
  color: ${colors.primaryNormal};
  cursor: pointer;

  &:hover {
    font-weight: ${fontWeight.semiBold};
  }
`;
