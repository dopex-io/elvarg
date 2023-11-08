import { useMemo } from 'react';
import { formatUnits } from 'viem';

import Typography2 from 'components/UI/Typography2';

import { formatAmount } from 'utils/general';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface Props {
  bondAmount: number;
  bondComposition: readonly [bigint, bigint];
  rdpxPrice: bigint;
}

const InfoBox = (props: Props) => {
  const { bondAmount, bondComposition, rdpxPrice } = props;

  // note: calculations in .js number precision
  const bondDiscount = useMemo(() => {
    if (!bondAmount) return [0, 0];

    const rdpxRequiredPerBond =
      Number(formatUnits(bondComposition[0], DECIMALS_TOKEN)) * bondAmount;
    const ethRequiredPerBond =
      Number(formatUnits(bondComposition[1], DECIMALS_TOKEN)) * bondAmount;
    const _rdpxPrice = Number(formatUnits(rdpxPrice, DECIMALS_STRIKE));
    const trueRdpxBondCost = (bondAmount * 0.25) / _rdpxPrice;

    const trueEthBondCost = bondAmount * 0.75;

    const rdpxDiffFromTrueCost = trueRdpxBondCost - rdpxRequiredPerBond;
    const ethDiffFromTrueCost = trueEthBondCost - ethRequiredPerBond;

    return [rdpxDiffFromTrueCost, ethDiffFromTrueCost];
  }, [bondAmount, bondComposition, rdpxPrice]);

  return (
    <div className="flex flex-col border border-carbon rounded-xl p-3 space-y-2">
      <div className="flex divide-carbon justify-between">
        <Typography2 variant="caption" color="stieglitz" className="my-auto">
          Discount
        </Typography2>
        <div className="flex space-x-1">
          <div className="space-x-1">
            <Typography2 variant="caption">
              {formatAmount(bondDiscount[0], 3)}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              rDPX
            </Typography2>
          </div>
          <div className="space-x-1">
            <Typography2 variant="caption">
              {formatAmount(bondDiscount[1], 3)}
            </Typography2>
            <Typography2 variant="caption" color="stieglitz">
              WETH
            </Typography2>
          </div>
        </div>
      </div>
      <div className="flex divide-carbon justify-between">
        <Typography2 variant="caption" color="stieglitz">
          Bonding Limit
        </Typography2>
        <Typography2 variant="caption" color="white" className="space-x-1">
          -<span className="text-stieglitz">/</span>-
          <span className="text-stieglitz">rtETH</span>
        </Typography2>
      </div>
    </div>
  );
};

export default InfoBox;
