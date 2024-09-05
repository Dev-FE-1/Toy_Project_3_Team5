import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Camera } from 'lucide-react';
import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { useAuthStore } from '@/stores/useAuthStore';

export const ProfileUpdate = () => {
  const { profileImage, channelName } = useAuthStore();
  const [hashtag, setHashtag] = useState<string>('');

  return (
    <div css={containerStyle}>
      <div css={profileContainerStyle}>
        <div css={profileStyle}>
          <Profile src={profileImage} alt='프로필 이미지' size='xl' />
          <div css={cameraIconStyle}>
            <Camera color={colors.white} size={24} />
          </div>
        </div>
        <span css={profileNameStyle}>{channelName}</span>
      </div>
      <form css={formContainerStyle}>
        <div css={duplicateStyle}>
          <InputBox
            label='채널 이름'
            placeholder='채널 이름을 입력해주세요'
            value={channelName}
            onChange={() => {}}
            width='315px'
          />
          <div style={{ marginLeft: `5px` }}>
            <Button
              label='중복검사'
              color='gray'
              onClick={() => {}}
              size='lg'
            />
          </div>
        </div>
        <InputBox
          label='해시태그 (최대 10개)'
          placeholder='#'
          value={hashtag}
          onChange={() => {}}
          width='315px'
        />
        <Button
          label='프로필 저장'
          onClick={() => {}}
          type='submit'
          size='lg'
          fullWidth={true}
        />
      </form>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const profileContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.gray02};
`;

const profileStyle = css`
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${colors.black};
    opacity: 0.3;
    border-radius: 50%;
  }

  &:hover {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${colors.black};
      opacity: 0.5;
      border-radius: 50%;
    }
  }
`;

const cameraIconStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const profileNameStyle = css`
  margin: 6px 0;
  font-size: ${fontSize.xl};
  color: ${colors.black};
`;

const duplicateStyle = css`
  display: flex;
  align-items: center;
`;

const formContainerStyle = css``;
