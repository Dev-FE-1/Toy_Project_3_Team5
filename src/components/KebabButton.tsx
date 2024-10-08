import { useState, useRef } from 'react';
import { css } from '@emotion/react';
import { EllipsisVertical } from 'lucide-react';
import IconButton from '@/components/IconButton';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import useOutsideClick from '@/hooks/useOutsideClick';

interface KebabButtonProps {
  menuItems: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const KebabButton: React.FC<KebabButtonProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const onMenuItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  useOutsideClick(menuRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <div css={kebabButtonStyle} ref={menuRef}>
      <IconButton
        IconComponent={EllipsisVertical}
        color='gray'
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <ul css={menuModalStyle}>
          {menuItems.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              onClick={() => onMenuItemClick(item.onClick)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const kebabButtonStyle = css`
  position: relative;
  width: fit-content;
`;

const menuModalStyle = css`
  position: absolute;
  top: 30px;
  right: 8px;
  width: 124px;
  background-color: ${colors.white};
  border-radius: 4px;
  z-index: 10;
  box-shadow:
    0px 3px 8px 2px rgba(0, 0, 0, 0.12),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 5px 5px -3px rgba(0, 0, 0, 0.2);

  li {
    font-size: ${fontSize.md};
    padding: 8px 16px;
    :hover {
      background-color: ${colors.gray01};
    }
  }
`;

export default KebabButton;
