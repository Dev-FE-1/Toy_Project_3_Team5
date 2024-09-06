import { Fragment } from 'react';
import { css } from '@emotion/react';
import { Transition } from '@headlessui/react';
import { ChevronUp } from 'lucide-react';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

interface VideoInfoProps {
  playlistName: string;
  subject: string;
  thumbnail?: string;
}

interface MiniPlaylistProps {
  isActive: boolean;
  videoInfo: VideoInfoProps;
  onClose: () => void;
}

const defaultImg = '/src/assets/defaultThumbnail.jpg';

const MiniPlaylist = ({ isActive, videoInfo, onClose }: MiniPlaylistProps) => (
  <Transition
    show={isActive}
    appear={isActive}
    as={Fragment}
    enterFrom='transition-enter-from'
    enterTo='transition-enter-to'
    leaveFrom='transition-leave-from'
    leaveTo='transition-leave-to'
  >
    <div css={toastStyle} onClick={onClose}>
      <img
        css={thumbnailStyle}
        src={videoInfo.thumbnail ? videoInfo.thumbnail : defaultImg}
      />
      <div css={infoStyle}>
        <span css={messageStyle} className='subject'>
          {videoInfo.subject}
        </span>
        <span css={messageStyle} className='playlistName'>
          {videoInfo.playlistName}
        </span>
      </div>
      <div css={buttonStyle}>
        <ChevronUp />
      </div>
    </div>
  </Transition>
);

const toastStyle = css`
  max-width: 430px;
  /* width: calc(100vw - 32px - 40px); */
  position: fixed;
  margin: 0px 20px;
  bottom: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  border-radius: 4px;
  background-color: ${colors.gray04};
  color: ${colors.white};
  z-index: 1000;
  transition: all 0.2s ease-in;
  cursor: pointer;

  &.transition-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  &.transition-enter-to {
    opacity: 1;
    transform: translateY(0);
  }

  &.transition-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  &.transition-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
`;

const thumbnailStyle = css`
  position: relative;
  width: 80px;
  height: 45px;
  margin: 0 10px;
`;

const infoStyle = css`
  display: flex;
  flex-direction: column;
  font-size: ${fontSize.md};
  flex-grow: 1;
`;

const buttonStyle = css`
  padding: 0 10px;
`;

const messageStyle = css`
  font-size: ${fontSize.md};
  font-weight: 500;

  &.subject {
    color: ${colors.white};
    font-size: ${fontSize.md};
  }
  &.playlistName {
    color: ${colors.gray02};
    font-size: ${fontSize.md};
  }
`;

export default MiniPlaylist;
