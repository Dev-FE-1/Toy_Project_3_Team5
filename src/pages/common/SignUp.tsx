import { useState } from 'react';
import { css } from '@emotion/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Header from '@/components/Header';
import InputBox from '@/components/InputBox';
import Toast from '@/components/Toast';
import colors from '@/constants/colors';
import ROUTES from '@/constants/route';
import { auth, db } from '@/firebase/firbaseConfig';
import useToast from '@/hooks/useToast';

export const SignUp = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');

  const [idCheckMessage, setIdCheckMessage] = useState<string>('');
  const [channelNameCheckMessage, setChannelNameCheckMessage] =
    useState<string>('');

  const [isIdChecked, setIsIdChecked] = useState<boolean>(false);
  const [isChannelNameChecked, setIsChannelNameChecked] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const { toastTrigger } = useToast();

  const checkChannelNameExists = async (
    channelName: string
  ): Promise<boolean> => {
    const q = query(
      collection(db, 'users'),
      where('channelName', '==', channelName)
    );

    try {
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      throw new Error('중복 체크에 실패했습니다.');
    }
  };

  const checkIdExists = async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      throw new Error('중복 체크에 실패했습니다.');
    }
  };

  const onIdCheck = async () => {
    const idValidationMessage = validateId(id);
    if (idValidationMessage) {
      setIdCheckMessage(idValidationMessage);
      setIsIdChecked(false);
      return;
    }

    try {
      const idExists = await checkIdExists(id);
      if (idExists) {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      } else {
        setIdCheckMessage('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      }
    } catch (error) {}
  };

  const onChannelNameCheck = async () => {
    const channelNameValidation = validateChannelName(channelName);
    if (channelNameValidation) {
      setChannelNameCheckMessage(channelNameValidation);
      setIsChannelNameChecked(false);
      return;
    }

    try {
      const exists = await checkChannelNameExists(channelName.trim());
      if (exists) {
        setChannelNameCheckMessage('이미 사용 중인 채널 이름입니다.');
        setIsChannelNameChecked(false);
      } else {
        setChannelNameCheckMessage('사용 가능한 채널 이름입니다.');
        setIsChannelNameChecked(true);
      }
    } catch (error) {}
  };

  const onChannelNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setChannelName(e.target.value);
    setIsChannelNameChecked(false);
    setChannelNameCheckMessage(
      e.target.value === '' ? '' : '다시 중복검사를 진행해주세요.'
    );
  };

  const onIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setId(e.target.value);
    setIsIdChecked(false);
    setIdCheckMessage(
      e.target.value === '' ? '' : '다시 중복검사를 진행해주세요.'
    );
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isIdChecked || !isChannelNameChecked) {
      toastTrigger('중복 검사를 진행해주세요.', 'fail');
      return;
    }

    const email = `${id}@gmail.com`;

    try {
      const idExists = await checkIdExists(id);
      if (idExists) {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      await setDoc(doc(db, 'users', id), {
        uid: user.uid,
        channelName,
        channelFollower: [],
        channelFollowing: [],
        savedPlaylist: [],
        likedPlaylist: [],
        profileImg: '',
        tags: [],
        isFirstLogin: true,
      });
      navigate(ROUTES.SIGN_IN);
      toastTrigger('회원가입이 완료되었습니다! 🥳', 'success');
    } catch (error) {}
  };

  const validateId = (value: string) => {
    if (value.length < 5) {
      return '아이디는 5자리 이상이어야 합니다';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,}$/;
    if (!regex.test(value)) {
      return '비밀번호는 6자리 이상, 특수문자(!,@,-,$,*)포함이어야 합니다';
    }
    return '사용 가능한 비밀번호입니다.';
  };

  const validatePasswordConfirm = (value: string) => {
    if (value !== password) {
      return '비밀번호가 다릅니다';
    }
    return '비밀번호가 일치합니다.';
  };

  const validateChannelName = (value: string) => {
    if (value.length < 2) {
      return '채널 이름은 2자리 이상이어야 합니다';
    }
    return '';
  };

  const isSignUpDisabled =
    id.length < 5 ||
    password.length < 6 ||
    passwordConfirm.length < 6 ||
    channelName.length < 2;

  return (
    <div css={containerStyle}>
      <Header type='detail' headerTitle='회원가입' />
      <form onSubmit={onSignUp} css={signUpContainerStyle}>
        <div css={duplicateStyle}>
          <InputBox
            label='아이디'
            placeholder='아이디'
            value={id}
            validate={validateId}
            onChange={onIdChange}
            width='315px'
            externalErrorMessage={idCheckMessage}
          />
          <div style={{ marginLeft: `5px` }}>
            <Button
              label='중복검사'
              color='gray'
              size='lg'
              onClick={onIdCheck}
            />
          </div>
        </div>
        <InputBox
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          value={password}
          validate={validatePassword}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          isPassword
        />
        <InputBox
          label='비밀번호 확인'
          placeholder='비밀번호 확인'
          value={passwordConfirm}
          validate={validatePasswordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
          }}
          isPassword
        />
        <div css={duplicateStyle}>
          <InputBox
            label='채널 이름'
            placeholder='채널 이름을 입력해주세요'
            value={channelName}
            validate={validateChannelName}
            onChange={onChannelNameChange}
            width='315px'
            externalErrorMessage={channelNameCheckMessage}
          />
          <div style={{ marginLeft: `5px` }}>
            <Button
              label='중복검사'
              color='gray'
              onClick={onChannelNameCheck}
              size='lg'
            />
          </div>
        </div>
        <div style={{ width: `390px` }}>
          <Button
            label='회원가입'
            onClick={() => {}}
            size='lg'
            type='submit'
            fullWidth={true}
            disabled={isSignUpDisabled}
          />
        </div>
      </form>
      <Toast />
    </div>
  );
};

const containerStyle = css`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;

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

const signUpContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const duplicateStyle = css`
  display: flex;
  align-items: center;
`;
