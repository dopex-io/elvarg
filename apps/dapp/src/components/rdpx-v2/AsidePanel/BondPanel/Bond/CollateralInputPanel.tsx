import { useCallback, useEffect, useState } from 'react';
import { parseUnits } from 'viem';

import { useAccount } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import { BondType } from 'components/rdpx-v2/AsidePanel/BondPanel/Bond';
import InputRow from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/InputRow';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  inputAmount: string;
  setInputAmount: React.Dispatch<React.SetStateAction<string>>; // **note**: drilled prop may cause unintended side-effects
  // setApproved: Function;
  delegated: boolean;
  disabled?: boolean;
  bondingMethod: BondType;
}

const CollateralInputPanel = (props: Props) => {
  const { inputAmount, setInputAmount, delegated, bondingMethod } = props;
  const [amounts, setAmounts] = useState<readonly [bigint, bigint]>([0n, 0n]);

  const { address: account } = useAccount();

  const { rdpxV2CoreState, updateRdpxV2CoreState } = useRdpxV2CoreData({
    user: account || '0x',
  });

  const handleAmountsRecalculation = useCallback(() => {
    setAmounts([
      (rdpxV2CoreState.bondComposition[0] *
        parseUnits(inputAmount, DECIMALS_TOKEN)) /
        parseUnits('10', DECIMALS_TOKEN), // rDPX
      (rdpxV2CoreState.bondComposition[1] *
        parseUnits(inputAmount, DECIMALS_TOKEN)) /
        parseUnits('10', DECIMALS_TOKEN), // WETH
    ]);
  }, [rdpxV2CoreState.bondComposition, inputAmount]);

  useEffect(() => {
    handleAmountsRecalculation();
  }, [handleAmountsRecalculation]);

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  return (
    <div className="flex flex-col p-2 bg-umbra rounded-b-xl">
      <span className="text-sm text-stieglitz">Collateral Required</span>
      <div className="flex space-x-2 mt-2">
        <InputRow
          key={'B'}
          index={0}
          tokenSymbol="RDPX"
          amounts={amounts}
          setAmounts={setAmounts}
          setBonds={setInputAmount}
          rounded={1 === amounts.length - 1}
          bondComposition={rdpxV2CoreState.bondComposition}
        />
        {bondingMethod === BondType.Default ? (
          <InputRow
            key={'A'}
            index={1}
            tokenSymbol="WETH"
            amounts={amounts}
            setAmounts={setAmounts}
            setBonds={setInputAmount}
            rounded={0 === amounts.length - 1}
            bondComposition={rdpxV2CoreState.bondComposition}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CollateralInputPanel;
