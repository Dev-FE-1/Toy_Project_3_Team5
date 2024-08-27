import { css } from '@emotion/react';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import useModalStore from '@/stores/useModalStore';

const Modal: React.FC = () => {
  const { isOpen, modalData, closeModal } = useModalStore();

  if (!isOpen || !modalData) return null;

  const { type, title, content, onAction } = modalData;

  return (
    <div css={modalBackgroundStyles}>
      <div className='modal'>
        <h1>{title}</h1>
        <h3>{content}</h3>
        <div className='modal-buttons'>
          <Button
            label='취소'
            shape='line'
            color='gray'
            onClick={() => {
              closeModal();
            }}
          />
          {type === 'confirm' && (
            <Button
              label='확인'
              onClick={() => {
                onAction();
                closeModal();
              }}
            />
          )}
          {type === 'delete' && (
            <Button
              label='삭제'
              color='red'
              onClick={() => {
                onAction();
                closeModal();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const modalBackgroundStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  .modal {
    position: absolute;
    flex-direction: column;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.white};
    display: flex;
    border-radius: 8px;
    width: 390px;
    box-shadow:
      0px 6px 30px 5px rgba(0, 0, 0, 0.12),
      0px 16px 24px 2px rgba(0, 0, 0, 0.14),
      0px 8px 10px -5px rgba(0, 0, 0, 0.2);

    h1 {
      font-size: ${fontSize.lg};
      padding: 16px 20px;
      font-weight: ${fontWeight.semiBold};
    }

    h3 {
      font-size: ${fontSize.lg};
      padding: 12px 20px 0px 20px;
      text-align: center;
      line-height: 27px;
    }

    .modal-buttons {
      padding: 20px;
      display: flex;
      gap: 8px;
      button {
        width: 100%;
      }
    }
  }
`;

export default Modal;
