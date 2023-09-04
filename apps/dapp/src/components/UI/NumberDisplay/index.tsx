import { ReactNode } from 'react';
import { BigNumber, utils as ethersUtils } from 'ethers';

import Tooltip from '@mui/material/Tooltip';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  n: BigNumber;
  decimals: number | BigNumber;
  altText?: ReactNode;
  minNumber?: number;
  decimalsToShow?: number;
  rightText?: string;
}

const NumberDisplay = ({
  n,
  decimals,
  altText,
  minNumber = 0.0001,
  decimalsToShow = 4,
  rightText,
}: Props) => {
  if (BigNumber.from(decimals).gt(18)) throw Error('Decimals cannot exceed 18');

  const _val = Number(ethersUtils.formatUnits(n, decimals));

  if (_val < minNumber && _val !== 0) {
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
      {rightText}
    </span>
  );
};

export default NumberDisplay;
