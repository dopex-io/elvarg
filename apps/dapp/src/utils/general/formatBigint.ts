import { formatUnits } from 'viem';

import formatAmount from 'utils/general/formatAmount';

const formatBigint = (value: bigint, decimals = 18, decimalPoints = 3) => {
  return formatAmount(formatUnits(value, decimals), decimalPoints);
};

export default formatBigint;
