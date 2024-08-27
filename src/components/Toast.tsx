import { Fragment, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Transition } from '@headlessui/react';
import { CircleCheck, CircleX } from 'lucide-react';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

type ToastStatusType = 'success' | 'fail';

interface ToastProps {
  duration?: number;
  status?: ToastStatusType;
  isActive: boolean;
  toastMsg: string;
  onClose: () => void;
}

const Toast = ({
  duration = 2000,
  status = 'success',
  isActive,
  toastMsg,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, onClose, duration]);

  return (
    <div css={transStyle}>
      <Transition
        show={isActive}
        appear={isActive}
        as={Fragment}
        enterFrom='transition-enter-from'
        enterTo='transition-enter-to'
        leaveFrom='transition-leave-from'
        leaveTo='transition-leave-to'
      >
        <div css={toastStyle}>
          <div css={iconContainerStyle}>
            {status === 'success' ? (
              <CircleCheck css={successStyle} />
            ) : (
              <CircleX css={failStyle} />
            )}
          </div>
          <span css={messageStyle}>{toastMsg}</span>
        </div>
      </Transition>
    </div>
  );
};

const transStyle = css``;

const toastStyle = css`
  width: calc(100vw - 32px);
  position: fixed;
  left: 50%;
  margin-left: calc((-1) * (100vw - 32px) / 2);
  bottom: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  border-radius: 4px;
  background-color: ${colors.gray04};
  color: ${colors.white};
  z-index: 1000;
  transition: all 0.2s ease-in;

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

const iconContainerStyle = css`
  position: relative;
  background-color: ${colors.white};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    line-height: 1;
  }
`;

const successStyle = css`
  color: ${colors.greenLight};
`;

const failStyle = css`
  color: ${colors.redNormal};
`;

const messageStyle = css`
  font-size: ${fontSize.md};
  font-weight: 500;
`;

export default Toast;
