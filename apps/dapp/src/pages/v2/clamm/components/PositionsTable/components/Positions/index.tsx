import React from 'react';

import BuyPositions from './components/BuyPositions';
import LPPositions from './components/LPPositions';

type Props = {
  selectedPositions: Map<number, any | null>;
  selectPosition: Function;
  deselectPosition: Function;
  positionsTypeIndex: number;
};
const Positions = (props: Props) => {
  const { positionsTypeIndex } = props;
  return (
    <div className="w-full h-fit">
      {positionsTypeIndex === 0 && <BuyPositions />}
      {positionsTypeIndex === 1 && <LPPositions />}
    </div>
  );
};

export default Positions;
