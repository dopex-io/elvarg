import { useCallback, useEffect, useState } from 'react';
import { MockToken__factory } from '@dopex-io/sdk';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Slider from '@mui/material/Slider';

import { useBoundStore } from 'store';

import InputRow from 'components/rdpx-v2/BondPanel/Bond/InputRow';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface Props {
  inputAmount: number;
  setApproved: Function;
  delegated: boolean;
}

const CollateralInputPanel = (props: Props) => {
  const { inputAmount, setApproved, delegated } = props;

  const { accountAddress, provider, treasuryData, treasuryContractState } =
    useBoundStore();

  const [amounts, setAmounts] = useState([0, 0, 0]);

  const handleAmountsRecalcuation = useCallback(() => {
    if (!treasuryData) return;
    const _amounts = treasuryData.bondCostPerDsc;
    const _premium = treasuryData.premiumPerDsc;

    setAmounts([
      getUserReadableAmount(_amounts[0], 18) * inputAmount, // rDPX
      getUserReadableAmount(_amounts[1], 18) * inputAmount, // WETH
      getUserReadableAmount(_premium, 18) * inputAmount,
    ]);
  }, [inputAmount, treasuryData]);

  useEffect(() => {
    handleAmountsRecalcuation();
  }, [handleAmountsRecalcuation]);

  useEffect(() => {
    (async () => {
      if (!treasuryContractState.contracts || !accountAddress || !amounts[1])
        return;

      const treasury = treasuryContractState.contracts.treasury.address;

      if (treasuryData.dscPrice.eq('0')) return;

      const [rdpxAllowance, wethAllowance] = await Promise.all([
        MockToken__factory.connect(
          treasuryData.tokenA.address, // weth
          provider
        ).allowance(accountAddress, treasury),
        MockToken__factory.connect(
          treasuryData.tokenB.address, // rdpx
          provider
        ).allowance(accountAddress, treasury),
      ]);

      setApproved(
        rdpxAllowance.gte(getContractReadableAmount(amounts[0] || 0, 18)) &&
          (delegated ||
            wethAllowance.gte(getContractReadableAmount(amounts[1] || 0, 18)))
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
    <div className="p-3 bg-umbra rounded-xl space-y-2">
      <div className="flex space-x-1">
        <p className="text-xs my-auto">Collateral Required</p>
        <Tooltip
          title="rDPX / WETH cost including 25% OTM put option premium"
          arrow
        >
          <InfoOutlinedIcon className="fill-current text-stieglitz p-1" />
        </Tooltip>
      </div>
      <InputRow
        tokenSymbol={treasuryData.tokenB.symbol}
        inputAmount={amounts[0] || 0}
        label="25%"
      />
      <InputRow
        tokenSymbol={treasuryData.tokenA.symbol}
        inputAmount={amounts[1] || 0}
        label="75%"
      />
      <InputRow
        tokenSymbol={'Premium'}
        inputAmount={amounts[2] || 0}
        label="WETH"
      />
    </div>
  );
};

export default CollateralInputPanel;
