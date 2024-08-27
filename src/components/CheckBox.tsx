import React, { useState } from 'react';
import colors from '@/constants/colors';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckboxProps> = ({ checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const onCheckBoxChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <div onClick={onCheckBoxChange} style={{ cursor: 'pointer' }}>
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d={
            isChecked
              ? 'M16 0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.11 18 18 17.1 18 16V2C18 0.9 17.11 0 16 0ZM7 14L2 9L3.41 7.59L7 11.17L14.59 3.58L16 5L7 14Z'
              : 'M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z'
          }
          fill={isChecked ? colors.primaryLight : colors.gray05}
        />
      </svg>
    </div>
  );
};

export default CheckBox;
