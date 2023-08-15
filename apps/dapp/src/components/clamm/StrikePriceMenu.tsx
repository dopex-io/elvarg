import React from 'react';

import { Menu } from '@dopex-io/ui';

export function StrikePriceMenu() {
  const STRIKE_PRICES = [1866, 1860, 1850, 1840];
  const data = STRIKE_PRICES.map((key) => ({
    textContent: key,
    isDisabled: false,
  }));

  const [selectedStrikePrice, setSelectedStrikePrice] = React.useState(
    STRIKE_PRICES[0],
  );

  const handleSelection = (e: any) => {
    setSelectedStrikePrice(e.target.textContent);
  };

  return (
    <div>
      <h3>Option Type</h3>
      <div className="flex gap-4 mt-2">
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelection}
          selection={selectedStrikePrice}
          data={data}
          className="w-20"
          showArrow
        />
      </div>
    </div>
  );
}
