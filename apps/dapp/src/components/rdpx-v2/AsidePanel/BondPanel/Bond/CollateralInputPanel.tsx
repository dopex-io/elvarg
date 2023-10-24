import { useCallback, useEffect, useState } from 'react';

import { MockToken__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import InputRow from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/InputRow';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface Props {
  inputAmount: number;
  setInputAmount: React.Dispatch<React.SetStateAction<number | string>>; // **note**: drilled prop may cause unintended side-effects
  setApproved: Function;
  delegated: boolean;
  disabled?: boolean;
  bondingMethod: string;
}

const CollateralInputPanel = (props: Props) => {
  const { inputAmount, setInputAmount, setApproved, delegated, bondingMethod } =
    props;

  const { accountAddress, provider, treasuryData, treasuryContractState } =
    useBoundStore();

  const [amounts, setAmounts] = useState([0, 0]);

  const handleAmountsRecalculation = useCallback(() => {
    if (!treasuryData) return;
    const _amounts = treasuryData.bondCostPerDsc;

    setAmounts([
      getUserReadableAmount(_amounts[0], 18) * inputAmount, // rDPX
      getUserReadableAmount(_amounts[1], 18) * inputAmount, // WETH
    ]);
  }, [inputAmount, treasuryData]);

  useEffect(() => {
    handleAmountsRecalculation();
  }, [handleAmountsRecalculation]);

  useEffect(() => {
    (async () => {
      if (!treasuryContractState.contracts || !accountAddress || !amounts[1])
        return;

      const treasury = treasuryContractState.contracts.treasury.address;

      if (treasuryData.dscPrice.eq('0')) return;

      const [rdpxAllowance, wethAllowance] = await Promise.all([
        MockToken__factory.connect(
          treasuryData.tokenA.address, // rdpx
          provider,
        ).allowance(accountAddress, treasury),
        MockToken__factory.connect(
          treasuryData.tokenB.address, // weth
          provider,
        ).allowance(accountAddress, treasury),
      ]);

      setApproved(
        rdpxAllowance.gte(getContractReadableAmount(amounts[0] || 0, 18)) &&
          (delegated ||
            wethAllowance.gte(getContractReadableAmount(amounts[1] || 0, 18))),
      );
    })();
  }, [
    accountAddress,
    amounts,
    provider,
    setApproved,
    treasuryContractState.contracts,
    treasuryData,
    delegated,
  ]);

  return (
    <div className="bg-umbra rounded-b-xl">
      <div className="flex flex-col p-2 bg-umbra">
        <span className="text-sm text-stieglitz">Collateral Required</span>

        <div className="flex space-x-2 mt-2">
          <InputRow
            key={1}
            index={1}
            tokenSymbol={'RDPX'}
            amounts={amounts}
            setAmounts={setAmounts}
            setBonds={setInputAmount}
            rounded={1 === amounts.length - 1}
          />
          {bondingMethod === 'rDPX + ETH' ? (
            <InputRow
              key={0}
              index={0}
              tokenSymbol={'ETH'}
              amounts={amounts}
              setAmounts={setAmounts}
              setBonds={setInputAmount}
              rounded={0 === amounts.length - 1}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CollateralInputPanel;
