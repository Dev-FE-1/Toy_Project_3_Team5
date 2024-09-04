import { useState, useEffect } from 'react';
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
import Toast from '@/components/Toast';
import Toggle from '@/components/Toggle';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { auth } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

const DOMAIN = '@gmail.com';

export const SignIn = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailRemembered, setIsEmailRemembered] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const isFirstLogin = useAuthStore((state) => state.isFirstLogin);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setId(savedEmail);
      setIsEmailRemembered(true);
    }
  }, []);

  const onToggleChange = (enabled: boolean) => {
    setIsEmailRemembered(enabled);
    if (enabled) {
      localStorage.setItem('savedEmail', id);
    } else {
      localStorage.removeItem('savedEmail');
    }
  };

  const onEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const email = `${id}${DOMAIN}`;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      if (isFirstLogin) {
        navigate(ROUTES.HASH_TAG);
      } else {
        navigate(ROUTES.ROOT);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      setErrorMessage('아이디와 비밀번호를 확인해주세요');
    }
  };

  const onGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      if (isFirstLogin) {
        navigate(ROUTES.HASH_TAG);
      } else {
        navigate(ROUTES.ROOT);
      }
    } catch (error) {
      console.error('Google 로그인 중 오류 발생:', error);
      setErrorMessage(
        'Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

  const onSignUpMessage = (): void => {
    navigate(ROUTES.SIGN_UP);
  };

  const validateId = (id: string) =>
    id.length > 0 ? '' : '아이디를 입력해주세요';

  const validatePassword = (value: string) =>
    value.length > 0 ? '' : '비밀번호를 확인해주세요';

  const isLoginDisabled = id.length === 0 || password.length === 0;

  return (
    <div css={containerStyle}>
      <div css={formStyle}>
        <div style={{ marginBottom: '20px' }}>
          <Logo logoWidth={180} clickable={false} />
        </div>
        <form onSubmit={onEmailLogin}>
          <InputBox
            label='아이디'
            placeholder='아이디'
            value={id}
            validate={validateId}
            onChange={(e) => {
              setId(e.target.value);
              if (isEmailRemembered) {
                localStorage.setItem('savedEmail', e.target.value);
              }
            }}
          />
          <InputBox
            label='비밀번호'
            placeholder='비밀번호'
            value={password}
            validate={validatePassword}
            onChange={(e) => setPassword(e.target.value)}
            isPassword
          />
          {errorMessage && <div css={errorMessageStyle}>{errorMessage}</div>}
          <div css={toggleStyle}>
            <Toggle
              enabled={isEmailRemembered}
              setEnabled={onToggleChange}
              label={{ active: '로그인 정보 기억하기', inactive: '' }}
            />
            <div style={{ position: 'absolute', marginRight: '20px' }}></div>
          </div>
          <Button
            label='로그인'
            size='lg'
            fullWidth={true}
            type='submit'
            onClick={() => {}}
            disabled={isLoginDisabled}
          />
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
      <Toast />
    </div>
  );
};

const containerStyle = css`
  width: 100%;
  max-width: 430px;
  height: 100%;
  margin: 0 auto;
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */

  &::before {
    left: 50%;
    transform: translateX(-215px);
  }

  &::after {
    right: 50%;
    transform: translateX(215px);
  }

  &::before,
  &::after {
    width: 1px;
    position: fixed;
    top: 0px;
    bottom: 0px;
    background-color: ${colors.gray02};
    content: '';
    z-index: 11;
  }
`;

const formStyle = css`
  width: 100%;
  height: 100%;
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

const errorMessageStyle = css`
  color: ${colors.redNormal};
  font-size: ${fontSize.sm};
  margin-bottom: 10px;
  margin-top: -10px;
`;
