import { useState, useEffect } from 'react';

import { useBoundStore } from 'store';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

const InfoBox = (props: { value: string; delegated?: boolean }) => {
  const { value, delegated = false } = props;

  const { treasuryContractState, treasuryData } = useBoundStore();

  const [premium, setPremium] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (
        !treasuryContractState.alpha_token_ratio_percentage ||
        !treasuryContractState.rdpx_reserve ||
        !treasuryData.premiumPerDsc ||
        !treasuryData.bondCostPerDsc ||
        !treasuryData.premiumPerDsc
      )
        return;
      const _amount = getContractReadableAmount(value, 18);
      const one_ether = getContractReadableAmount(1, 18);
      const total_premium = treasuryData.premiumPerDsc
        .mul(_amount)
        .div(one_ether);

      const default_precision = getContractReadableAmount(1, 8);
      const required_weth_no_discount =
        treasuryContractState.alpha_token_ratio_percentage
          .mul(_amount)
          .div(default_precision.mul(1e2));
      const bond_discount = treasuryData.bondCostPerDsc[1]
        .mul(_amount)
        .div(one_ether)
        .sub(required_weth_no_discount);
      setPremium(getUserReadableAmount(total_premium, 18));
      setDiscount(getUserReadableAmount(bond_discount, 18));
    })();
  }, [treasuryContractState, treasuryData, value]);

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
        <div className="flex flex-col w-1/2 p-2 space-y-1">
          <p className={`text-xs ${discount < 0 ? 'text-up-only' : 'null'}`}>
            {formatAmount(discount, 3)} WETH
          </p>
          <p className="text-xs text-stieglitz">Discount</p>
        </div>
      </div>
      {delegated ? (
        <div className="flex divide-x divide-carbon">
          <div className="flex flex-col w-full p-2 text-start space-y-1">
            <p className="text-xs">-</p>
            <p className="text-xs text-stieglitz">Avg. Delegate Fee</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InfoBox;
