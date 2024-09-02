import { useState } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import Header from '@/components/Header';
import InputBox from '@/components/InputBox';

export const SignUp = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');

  const validateId = (value: string) => {
    if (value.length < 6) {
      return '아이디는 6자리 이상이어야 합니다';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,}$/;
    if (!regex.test(value)) {
      return '비밀번호는 5자리 이상, 특수문자 포함이어야 합니다';
    }
    return '';
  };

  const validatePasswordConfirm = (value: string) => {
    if (value !== password) {
      return '비밀번호가 다릅니다';
    }
    return '';
  };

  const validateChannelName = (value: string) => {
    if (value.length < 2) {
      return '채널 이름은 2자리 이상이어야 합니다';
    }
    return '';
  };

  return (
    <div>
      <Header type='detail' headerTitle='회원가입' />
      <form onSubmit={() => {}} css={signUpContainerStyle}>
        <div css={duplicateStyle}>
          <InputBox
            label='아이디'
            placeholder='아이디'
            value={id}
            validate={validateId}
            onChange={(e) => {
              setId(e.target.value);
            }}
            width='315px'
          />
          <div style={{ marginLeft: `5px` }}>
            <Button
              label='중복검사'
              color='gray'
              size='md'
              onClick={() => {}}
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
            onChange={(e) => {
              setChannelName(e.target.value);
            }}
            width='315px'
          />
          <div style={{ marginLeft: `5px` }}>
            <Button label='중복검사' color='gray' onClick={() => {}} />
          </div>
        </div>
        <div style={{ width: `390px` }}>
          <Button
            label='회원가입'
            onClick={() => {}}
            size='lg'
            type='submit'
            fullWidth={true}
          />
        </div>
      </form>
    </div>
  );
};

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
  justify-content: center;
`;
