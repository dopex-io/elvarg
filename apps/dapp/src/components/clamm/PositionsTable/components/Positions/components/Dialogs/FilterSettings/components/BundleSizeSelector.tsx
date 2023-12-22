import React from 'react';

import { Item, Root } from '@radix-ui/react-toggle-group';

const BundleSizeSelector = () => {
  return (
    <Root
      type="single"
      className="p-[4px] space-x-[12px] bg-carbon flex items-center justify-center rounded-md"
    >
      {[5, 10, 20, 50].map((value, index) => (
        <Item
          className="w-[16px] h-[16px] text-stieglitz data-[state=on]:text-white rounded-sm"
          value={index.toString()}
          key={`bundle-selector-item-${value}`}
        >
          <p className="text-xs w-full">{value}</p>
        </Item>
      ))}
    </Root>
  );
};

export default BundleSizeSelector;
