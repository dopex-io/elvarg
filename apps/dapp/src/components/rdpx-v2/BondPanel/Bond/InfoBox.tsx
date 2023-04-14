import { useState, useEffect, useCallback } from 'react';
import { BigNumber } from 'ethers';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/styles';

import { useBoundStore } from 'store';
import { DelegateType } from 'store/RdpxV2/dpxeth-bonding';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import formatAmount from 'utils/general/formatAmount';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ color }) => ({
  '& .MuiTooltip-tooltip': {
    background: color,
  },
}));

const InfoBox = (props: { value: string; delegated?: boolean }) => {
  const { value, delegated = false } = props;

  const { treasuryContractState, treasuryData, squeezeTreasuryDelegates } =
    useBoundStore();

  const [premium, setPremium] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [avgFee, setAvgFee] = useState<number>(0);
  const [share, setShare] = useState<number>(0);

  const calculateDelegateData = useCallback(async () => {
    if (
      !treasuryContractState.alpha_token_ratio_percentage ||
      !treasuryContractState.rdpx_reserve ||
      !treasuryData.premiumPerDsc ||
      !treasuryData.bondCostPerDsc ||
      !treasuryData.premiumPerDsc ||
      !treasuryData.availableDelegates
    )
      return;

    // Calculate bond discount; bond_cost_with_discount - bond_cost_without_discount
    const default_precision = getContractReadableAmount(1, 8);
    const one_ether = getContractReadableAmount(1, 18);
    const _amount = getContractReadableAmount(value, 18);
    const requiredWethNoDiscount =
      treasuryContractState.alpha_token_ratio_percentage
        .mul(_amount)
        .div(default_precision.mul(1e2));

    const bondDiscount = getUserReadableAmount(
      treasuryData.bondCostPerDsc[1]
        .mul(_amount)
        .div(one_ether)
        .sub(requiredWethNoDiscount)
        .mul(-1),
      18
    );
    const totalPremium = getUserReadableAmount(
      treasuryData.premiumPerDsc.mul(_amount).div(one_ether),
      18
    );

    // Calculate average fee across delegates based on weight of delegates' collateral used
    const availableDelegates: DelegateType[] = treasuryData.availableDelegates;
    const wethPerDsc = treasuryData.bondCostPerDsc[1];
    const bonds = getContractReadableAmount(value, 18);
    const totalWethRequired = wethPerDsc
      .mul(getContractReadableAmount(value, 18))
      .div(getContractReadableAmount(1, 18));

    const { ids, amounts } = squeezeTreasuryDelegates(
      availableDelegates,
      totalWethRequired,
      bonds
    ) || {
      wethAvailable: BigNumber.from(0),
      ids: [0],
      amounts: [BigNumber.from(0)],
    };
    const activeDelegatesFees = availableDelegates
      .filter((val) => ids.includes(val._id))
      .map((delegate) => getUserReadableAmount(delegate.fee, 8));
    const weights = amounts.map((_amount) =>
      getUserReadableAmount(
        _amount.mul(getContractReadableAmount(1, 10)).div(bonds),
        10
      )
    );
    const _avgFee =
      activeDelegatesFees.reduce(
        (prev, curr, i) => curr + prev * (weights[i] ?? 0),
        0
      ) / activeDelegatesFees.length;

    // Calculate delegatee's share; 25% of bonds - (discount - discount * fee_percentage)
    let share = getUserReadableAmount(bonds, 18) * 0.25;
    const discountShare = bondDiscount * 0.25;
    const deductedDiscount = discountShare - (discountShare * avgFee) / 100;
    share = share + deductedDiscount;

    const discountPercentage = Math.abs(
      getUserReadableAmount(
        totalWethRequired
          .sub(requiredWethNoDiscount)
          .mul(getContractReadableAmount(1, 18))
          .div(totalWethRequired.gt(0) ? totalWethRequired : '1'),
        18
      ) * 100
    );

    setShare(share || 0);
    setPremium(totalPremium || 0);
    setDiscount(delegated ? deductedDiscount : bondDiscount || 0);
    setDiscountPercent(discountPercentage || 0);
    setAvgFee(_avgFee || 0);
  }, [
    treasuryContractState,
    treasuryData,
    value,
    delegated,
    setShare,
    setPremium,
    setDiscount,
    setAvgFee,
    squeezeTreasuryDelegates,
  ]);

  useEffect(() => {
    calculateDelegateData();
  }, [calculateDelegateData]);

  return (
    <div className="flex flex-col border border-carbon rounded-xl divide-y divide-carbon">
      <div className="flex divide-x divide-carbon">
        <div className="flex flex-col w-1/2 p-2 text-start space-y-1">
          <p className="text-xs">
            {premium > 0 ? '~' : null}
            {formatAmount(premium, 3)} WETH
          </p>
          <p className="text-xs text-stieglitz">Premium</p>
        </div>
        <StyledTooltip
          followCursor
          arrow={true}
          color="transparent"
          title={
            <div className="flex flex-col p-2 bg-carbon rounded-lg border border-mineshaft w-fit space-y-2 bg-opacity-50 backdrop-blur-md">
              <p className={`text-xs ${discount > 0 ? 'text-up-only' : null}`}>
                {formatAmount(discount, 3)} WETH
              </p>
            </div>
          }
        >
          <div className="flex flex-col w-1/2 p-2 space-y-1">
            <p
              className={`text-xs ${
                discountPercent > 0 ? 'text-up-only' : null
              } underline decoration-dashed`}
            >
              {formatAmount(discountPercent, 3)}%
            </p>
            <p className="text-xs text-stieglitz">Discount</p>
          </div>
        </StyledTooltip>
      </div>
      {delegated ? (
        <div className="flex divide-x divide-carbon">
          <div className="flex flex-col w-full p-2 text-start space-y-1">
            <p className="text-xs">{formatAmount(avgFee, 3)}%</p>
            <p className="text-xs text-stieglitz">Avg. Delegate Fee</p>
          </div>
          <div className="flex flex-col w-full p-2 text-start space-y-1">
            <p className="text-xs">{share.toFixed(3)} dpxETH</p>
            <p className="text-xs text-stieglitz">You Receive</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoBox;
