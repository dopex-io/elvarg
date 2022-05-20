import { ReactNode } from 'react';
import Tooltip from '@mui/material/Tooltip';
import BN from 'bignumber.js';
import { BigNumber } from 'ethers';

interface Props {
  n: BigNumber;
  decimals: number | BigNumber;
  altText?: ReactNode;
  minNumber?: number;
}

const NumberDisplay = ({ n, decimals, altText, minNumber = 0.0001 }: Props) => {
  if (BigNumber.from(decimals).gt(18)) throw Error('Decimals cannot exceed 18');

  const _val = new BN(n.toString()).dividedBy(`1e${decimals.toString()}`);

  if (_val.lt(minNumber)) {
    return (
      <Tooltip title={_val.toString()} placement="top">
        <span className="text-white">
          {altText ? altText : `<${minNumber}`}
        </span>
      </Tooltip>
    );
  }

  return <span className="text-white">{_val.toString()}</span>;
};

export default NumberDisplay;
