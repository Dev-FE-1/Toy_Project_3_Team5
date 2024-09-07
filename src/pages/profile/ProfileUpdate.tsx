import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  updateProfileImage,
  getMyHashtag,
  updateProfileTags,
} from '@/api/profileInfo';
import Button from '@/components/Button';
import HashTag from '@/components/HashTag';
import InputBox from '@/components/InputBox';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import { db } from '@/firebase/firbaseConfig';
import { useCheckDuplicate } from '@/hooks/useCheckDuplicate';
import { useHashtagManage } from '@/hooks/useHashtagManage';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { checkChannelNameExists } from '@/utils/checkDuplicate';

export const ProfileUpdate = () => {
  const { profileImage, channelName, userId } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profileImage);
  const [newChannelName, setNewChannelName] = useState<string>(channelName);

  const {
    message: channelNameCheckMessage,
    isChecked: isChannelNameChecked,
    checkDuplicate: checkChannelNameDuplicate,
    setMessage: setChannelNameCheckMessage,
    setIsChecked: setIsChannelNameChecked,
  } = useCheckDuplicate();

  const {
    hashtags,
    hashtag,
    setHashtags,
    setHashtag,
    addHashtag,
    removeHashtag,
  } = useHashtagManage();

  const navigate = useNavigate();
  const { toastTrigger } = useToast();

  useEffect(() => {
    const fetchHashtags = async () => {
      const fetchedHashtags = await getMyHashtag(userId);
      setHashtags(fetchedHashtags);
    };

    fetchHashtags();
  }, [userId]);

  const onChannelNameCheck = async () => {
    if (newChannelName === channelName) {
      setChannelNameCheckMessage('현재 채널 이름과 동일합니다.');
      setIsChannelNameChecked(true);
      return;
    }

    await checkChannelNameDuplicate(
      newChannelName,
      checkChannelNameExists,
      '이미 사용 중인 채널 이름입니다.',
      '사용 가능한 채널 이름입니다.'
    );
  };

  const onChannelNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewChannelName(e.target.value);
    setIsChannelNameChecked(false);
    setChannelNameCheckMessage('');
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const onProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newChannelName !== channelName && !isChannelNameChecked) {
      toastTrigger('채널 이름 중복 검사를 진행해주세요.', 'fail');
      return;
    }

    if (selectedImage && userId) {
      await updateProfileImage(userId, { profileImageFile: selectedImage });
    }

    if (userId) {
      await updateProfileTags(userId, hashtags);

      if (newChannelName !== channelName) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { channelName: newChannelName }, { merge: true });
      }
    }

    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const updatedData = userSnapshot.data();
      useAuthStore.setState({
        profileImage: updatedData.profileImg || previewUrl,
        channelName: updatedData.channelName || newChannelName,
      });
    }

    toastTrigger('프로필 수정이 완료되었습니다.', 'success');
    navigate(ROUTES.PROFILE(userId));
  };

  const validateChannelName = (value: string) => {
    if (value.length < 2) {
      return '채널 이름은 2자리 이상이어야 합니다';
    }
    return '';
  };

  return (
    <div css={containerStyle}>
      <div css={profileContainerStyle}>
        <label htmlFor='profileImageUpload' css={profileStyle}>
          <Profile src={previewUrl} alt='프로필 이미지' size='xl' />
          <div css={cameraIconStyle}>
            <Camera color={colors.white} size={24} />
          </div>
        </label>
        <input
          id='profileImageUpload'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={onImageChange}
        />
        <span css={profileNameStyle}>{channelName}</span>
      </div>
      <form css={formContainerStyle}>
        <div css={duplicateStyle}>
          <InputBox
            label='채널 이름'
            placeholder='채널 이름을 입력해주세요'
            value={newChannelName}
            onChange={onChannelNameChange}
            width='315px'
            externalErrorMessage={channelNameCheckMessage}
            validate={validateChannelName}
          />
          <Button
            label='중복검사'
            color='gray'
            onClick={onChannelNameCheck}
            size='lg'
          />
        </div>
        <InputBox
          label='해시태그 (최대 10개)'
          placeholder='#'
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          onKeyDown={addHashtag}
        />
        <HashTag
          margin='3px'
          tags={hashtags.map((tag, index) => ({
            id: index,
            label: tag,
            removable: true,
          }))}
          onRemove={removeHashtag}
        />
        <div style={{ marginTop: '20px' }}>
          <Button
            label='프로필 저장'
            onClick={onProfileSave}
            type='submit'
            size='lg'
            fullWidth={true}
          />
        </div>
      </form>
      <Modal />
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
  position: relative;

  button {
    height: 36px;
    position: absolute;
    right: 0;
    top: 18px;
  }
`;

const formContainerStyle = css`
  max-width: 390px;
`;
