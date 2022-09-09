import { ReactNode } from 'react';
import Tooltip from '@mui/material/Tooltip';
import BN from 'bignumber.js';
import { BigNumber } from 'ethers';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  n: BigNumber;
  decimals: number | BigNumber;
  altText?: ReactNode;
  minNumber?: number;
  decimalsToShow?: number;
}

const NumberDisplay = ({
  n,
  decimals,
  altText,
  minNumber = 0.0001,
  decimalsToShow = 2,
}: Props) => {
  if (BigNumber.from(decimals).gt(18)) throw Error('Decimals cannot exceed 18');

  const _val = new BN(n.toString()).dividedBy(`1e${decimals.toString()}`);

  if (_val.lt(minNumber) && !_val.isZero()) {
    return (
      <Tooltip title={_val.toString()} placement="top">
        <span className="text-white">
          {altText ? altText : `<${minNumber}`}
        </span>
      </Tooltip>
    );
  }

  return (
    <span className="text-white">
      {formatAmount(_val.toString(), decimalsToShow)}
    </span>
  );
};

export default NumberDisplay;
