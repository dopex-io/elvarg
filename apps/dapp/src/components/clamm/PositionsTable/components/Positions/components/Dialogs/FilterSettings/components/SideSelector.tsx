import React from 'react';

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { Item, Root } from '@radix-ui/react-toggle-group';

type Props = {
  onValueChange: (value: string[]) => void;
};
const SideSelector = ({ onValueChange }: Props) => {
  return (
    <Root
      type="multiple"
      onValueChange={onValueChange}
      defaultValue={['call', 'put']}
      className="flex items-center space-x-[4px] px-[4px] bg-carbon p-[2px] rounded-md"
    >
      <Item
        defaultChecked={true}
        value="call"
        className="flex items-center space-x-[4px] text-up-only data-[state=on]:bg-cod-gray p-[2px] rounded-sm"
      >
        <ArrowUpRightIcon height={14} width={14} />
      </Item>
      <Item
        value="put"
        className="flex items-center space-x-[4px] text-down-bad data-[state=on]:bg-cod-gray p-[2px] rounded-sm"
      >
        <ArrowDownRightIcon height={14} width={14} />
      </Item>
    </Root>
  );
};

export default SideSelector;
