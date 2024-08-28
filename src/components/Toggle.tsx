import { css } from '@emotion/react';
import { Switch } from '@headlessui/react';
import colors from '@/constants/colors';

type ToggleLabel = {
  active: string;
  inactive: string;
};

interface ToggleProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  label?: ToggleLabel;
}

const Toggle = ({ enabled, setEnabled, label }: ToggleProps) => {
  const onToggle = () => setEnabled(!enabled);

  return (
    <div css={toggleStyle}>
      {label && <span>{label.inactive}</span>}
      <Switch
        css={switchStyle(enabled)}
        onClick={onToggle}
        aria-checked={enabled}
      >
        <span css={switchThumbStyle(enabled)} />
      </Switch>
      {label && <span>{label.active}</span>}
    </div>
  );
};

const toggleStyle = css`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const switchStyle = (enabled: boolean) => css`
  display: flex;
  align-items: center;
  width: 44px;
  height: 24px;
  padding: 2px;
  border-radius: 12px;
  background-color: ${enabled ? colors.primaryLight : colors.gray03};
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  border: none;
`;

const switchThumbStyle = (enabled: boolean) => css`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${colors.white};
  transform: ${enabled ? 'translateX(20px)' : 'translateX(0)'};
  transition: transform 0.2s ease-in-out;
`;

export default Toggle;
