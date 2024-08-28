import React from 'react';
import { css } from '@emotion/react';
import { Tab } from '@headlessui/react';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

type TabType = 'owner' | 'visit';
interface TabBtnProps {
  type: TabType;
  profileId: string | number;
  componentList: React.ElementType[];
}

const TabButton = ({ type, profileId, componentList }: TabBtnProps) => {
  const tabs =
    type === 'owner'
      ? ['마이플리', '저장 플리', '좋아요']
      : ['마이플리', '저장 플리'];

  return (
    <Tab.Group>
      <Tab.List css={tabListStyle}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              selected ? 'selectedTabStyle' : 'tabStyle'
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {componentList.map((Component, index) => (
          <Tab.Panel key={index}>
            <Component />
            {profileId}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

const tabListStyle = css`
  display: flex;
  border-bottom: 1px solid ${colors.gray02};
  max-width: 430px;
  margin-bottom: 1rem;

  .selectedTabStyle {
    flex: 1;
    padding: 12px;
    font-size: ${fontSize.md};
    font-weight: 500;
    background: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    max-width: 430px;
    color: ${colors.black};
    border: none;
    border-bottom: 2px solid blue;
    outline: none;
  }

  .tabStyle {
    flex: 1;
    padding: 12px;
    font-size: ${fontSize.md};
    font-weight: 500;
    color: ${colors.gray04};
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    max-width: 430px;

    &:hover {
      color: ${colors.gray06};
    }
    &:focus {
      outline: none;
    }
  }
`;

export default TabButton;
