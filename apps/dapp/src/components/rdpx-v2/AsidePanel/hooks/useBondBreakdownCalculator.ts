import { useMemo } from 'react';
import { parseUnits } from 'viem';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  inputAmount: string;
  oneBondComposition: readonly [bigint, bigint];
}

const useBondBreakdownCalculator = ({
  inputAmount,
  oneBondComposition,
}: Props) => {
  return useMemo(
    () => [
      (parseUnits(inputAmount, DECIMALS_TOKEN) * oneBondComposition[0]) /
        parseUnits('1', DECIMALS_TOKEN),
      (parseUnits(inputAmount, DECIMALS_TOKEN) * oneBondComposition[1]) /
        parseUnits('1', DECIMALS_TOKEN),
    ],
    [inputAmount, oneBondComposition]
  );
};

export default useBondBreakdownCalculator;
