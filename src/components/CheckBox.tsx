import React from 'react';
import { css } from '@emotion/react';
import { Check, Square } from 'lucide-react';
import colors from '@/constants/colors';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckboxProps> = ({ checked = false, onChange }) => {
  const onCheckBoxChange = () => {
    onChange(!checked);
  };

  return (
    <div onClick={onCheckBoxChange} css={checkBoxContainer}>
      <Square css={checkBoxStyle} size={24} color={colors.gray05} />
      {checked && <Check css={checkStyle} size={20} color={colors.white} />}
    </div>
  );
};

const checkBoxContainer = css`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`;

const checkBoxStyle = css`
  position: absolute;
  top: 0;
  left: 0;
`;

const checkStyle = css`
  position: absolute;
  background-color: ${colors.primaryLight};
  border-radius: 2px;
  top: 2px;
  left: 2px;
`;

export default CheckBox;
