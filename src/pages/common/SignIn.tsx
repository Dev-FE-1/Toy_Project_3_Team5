import { useState } from 'react';
import { css } from '@emotion/react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import google from '@/assets/google_icon.svg';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import Logo from '@/components/Logo';
import Toggle from '@/components/Toggle';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { auth } from '@/firebase/firbaseConfig';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [a, seta] = useState<boolean>(false);
  const navigate = useNavigate();

  const onEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      navigate(ROUTES.ROOT);
      return user;
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  const onGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      navigate(ROUTES.ROOT);
      return user;
    } catch (error) {
      console.error('Google 로그인 중 오류 발생:', error);
    }
  };

  const onSignUpMessage = (): void => {
    navigate(ROUTES.SIGN_UP);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : '올바른 이메일 주소를 입력해주세요';
  };

  const validatePassword = (value: string) =>
    value.length >= 6 ? '' : '비밀번호를 확인해주세요';

  return (
    <div css={containerStyle}>
      <div style={{ marginBottom: '20px' }}>
        <Logo logoWidth={180} clickable={false} />
      </div>
      <form onSubmit={onEmailLogin}>
        <InputBox
          label='이메일'
          placeholder='이메일'
          value={email}
          validate={validateEmail}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputBox
          label='비밀번호'
          placeholder='비밀번호'
          value={password}
          validate={validatePassword}
          onChange={(e) => setPassword(e.target.value)}
          isPassword
        />
        <div css={toggleStyle}>
          <Toggle
            enabled={a}
            setEnabled={seta}
            label={{ active: '로그인 정보 기억하기', inactive: '' }}
          />
        </div>
        <Button label='로그인' size='lg' fullWidth={true} type='submit' />
        <div css={loginBtnStyle}>
          <div css={lineStyle}></div>
          <Button
            label='또는 구글로 로그인'
            onClick={onGoogleLogin}
            size='lg'
            color='black'
            IconComponent={google}
            fullWidth={true}
          />
        </div>
      </form>
      <div css={signUpMessageStyle}>
        계정이 없으신가요?{' '}
        <span onClick={onSignUpMessage} css={signUpStyle}>
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
