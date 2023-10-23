import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import Tooltip from '@mui/material/Tooltip';

import { useBoundStore } from 'store';
import { DelegateType } from 'store/RdpxV2/dpxeth-bonding';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import formatAmount from 'utils/general/formatAmount';

const InfoBox = (props: { value: string; delegated?: boolean }) => {
  const { value, delegated = false } = props;

  const {
    treasuryContractState,
    treasuryData,
    appContractData,
    squeezeTreasuryDelegates,
  } = useBoundStore();

  const [premium, setPremium] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [avgFee, setAvgFee] = useState<number>(0);
  const [share, setShare] = useState<number>(0);
  const [wethAvailable, setWethAvailable] = useState<number>(0);
  const [putsBalance, setPutsBalance] = useState<number>(0);

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
      18,
    );
    const totalPremium = getUserReadableAmount(
      treasuryData.premiumPerDsc.mul(_amount).div(one_ether),
      18,
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
      bonds,
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
        10,
      ),
    );
    const _avgFee =
      activeDelegatesFees.reduce(
        (prev, curr, i) => curr + prev * (weights[i] ?? 0),
        0,
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
        18,
      ) * 100,
    );

    // Calculate total WETH available from delegates
    const delegateBalance = getUserReadableAmount(
      treasuryData.availableDelegates.reduce((prev: BigNumber, curr: any) => {
        return prev.add(curr.amount.sub(curr.activeCollateral));
      }, BigNumber.from(0)),
      18,
    );

    const availablePutsLiquidity = getUserReadableAmount(
      appContractData.vaultData.totalCollateral.sub(
        appContractData.vaultData.activeCollateral,
      ),
      18,
    );

    setPutsBalance(availablePutsLiquidity);
    setWethAvailable(delegateBalance);
    setShare(share || 0);
    setPremium(totalPremium || 0);
    setDiscount(delegated ? deductedDiscount : bondDiscount || 0);
    setDiscountPercent(discountPercentage || 0);
    setAvgFee(_avgFee || 0);
  }, [
    treasuryContractState.alpha_token_ratio_percentage,
    treasuryContractState.rdpx_reserve,
    treasuryData.premiumPerDsc,
    treasuryData.bondCostPerDsc,
    treasuryData.availableDelegates,
    value,
    squeezeTreasuryDelegates,
    avgFee,
    appContractData.vaultData.totalCollateral,
    appContractData.vaultData.activeCollateral,
    delegated,
  ]);

  useEffect(() => {
    calculateDelegateData();
  }, [calculateDelegateData]);

  return (
    <div className="flex flex-col border border-carbon rounded-xl">
      <div className="flex divide-x divide-carbon">
        <Tooltip
          followCursor
          arrow={true}
          color="transparent"
          title={
            <div className="flex flex-col p-2 pb-1 bg-carbon rounded-lg border border-mineshaft w-fit space-y-2 bg-opacity-50 backdrop-blur-md">
              <p className={`text-xs ${discount > 0 ? 'text-up-only' : null}`}>
                {formatAmount(discount, 3)} WETH
              </p>
            </div>
          }
        >
          <div className="flex w-full p-2">
            <p className="text-xs text-stieglitz mr-auto">Discount</p>
            <p
              className={`text-xs ml-auto${
                discountPercent > 0 ? 'text-up-only' : null
              } underline decoration-dashed`}
            >
              {formatAmount(discountPercent, 3)}%
            </p>
          </div>
        </Tooltip>
      </div>
      <div className="flex divide-x divide-carbon">
        <div className="flex w-full p-2 pt-1 text-start space-y-1">
          <p className="text-xs text-stieglitz mr-auto">Cap</p>
          <span className="text-xs ml-auto text-white">
            931.41 <span className="text-stieglitz">/</span> 1341.21{' '}
            <span className="text-stieglitz">DPXETH</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
