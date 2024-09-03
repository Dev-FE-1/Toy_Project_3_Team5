import { Fragment, useEffect } from 'react';
import { css } from '@emotion/react';
import { Transition } from '@headlessui/react';
import { CircleCheck, CircleX } from 'lucide-react';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import useToast from '@/hooks/useToast';

type ToastStatusType = 'success' | 'fail';

interface ToastProps {
  duration?: number;
  status?: ToastStatusType;
}

const Toast = ({ duration = 2000, status = 'success' }: ToastProps) => {
  const { isToastOn, toastMsg, onClose } = useToast();
  // const { toastMsg, onClose } = useToast();
  // const isToastOn = true;

  useEffect(() => {
    if (isToastOn) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isToastOn, onClose, duration]);

  return (
    <div css={transStyle}>
      <Transition
        show={isToastOn}
        appear={isToastOn}
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
  width: calc(100vw - 40px);
  max-width: calc(430px - 40px);
  position: fixed;
  bottom: 60px;
  display: flex;
  align-items: center;
  padding: 16px;
  margin-left: 20px;
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
  border-radius: 50%;
  margin-right: 0.5rem;
  display: flex;
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
