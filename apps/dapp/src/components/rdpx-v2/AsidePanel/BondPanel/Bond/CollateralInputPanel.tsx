import { useCallback, useEffect, useState } from 'react';
import { parseUnits } from 'viem';

import { useAccount } from 'wagmi';

import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';

import { BondType } from 'components/rdpx-v2/AsidePanel/BondPanel/Bond';
import InputRow from 'components/rdpx-v2/AsidePanel/BondPanel/Bond/InputRow';
import Typography2 from 'components/UI/Typography2';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  inputAmount: string;
  setInputAmount: React.Dispatch<React.SetStateAction<string>>; // **note**: drilled prop may cause unintended side-effects
  bondComposition: readonly [bigint, bigint];
  bondingMethod: BondType;
}

const CollateralInputPanel = (props: Props) => {
  const { inputAmount, setInputAmount, bondComposition, bondingMethod } = props;
  const [amounts, setAmounts] = useState<readonly [bigint, bigint]>([0n, 0n]);

  const handleAmountsRecalculation = useCallback(() => {
    setAmounts([
      (bondComposition[0] * parseUnits(inputAmount, DECIMALS_TOKEN)) /
        parseUnits('1', DECIMALS_TOKEN), // rDPX
      (bondComposition[1] * parseUnits(inputAmount, DECIMALS_TOKEN)) /
        parseUnits('1', DECIMALS_TOKEN), // WETH
    ]);
  }, [bondComposition, inputAmount]);

  useEffect(() => {
    handleAmountsRecalculation();
  }, [handleAmountsRecalculation]);

  return (
    <div className="flex flex-col p-3 bg-umbra rounded-b-xl space-y-2">
      <Typography2 variant="caption" color="stieglitz">
        Collateral Required
      </Typography2>
      <div className="flex space-x-2 mt-2">
        <InputRow
          key={'B'}
          index={0}
          tokenSymbol="RDPX"
          amounts={amounts}
          setAmounts={setAmounts}
          setBonds={setInputAmount}
          rounded={1 === amounts.length - 1}
          bondComposition={bondComposition}
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
            bondComposition={bondComposition}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CollateralInputPanel;
