import React from 'react';

type Props = {
  selectedPositions: Map<number, any | null>;
  selectPosition: Function;
  deselectPosition: Function;
  positionsTypeIndex: number;
};
const Positions = (props: Props) => {
  return <div>Positions</div>;
};

export default Positions;
