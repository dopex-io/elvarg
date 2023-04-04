import { useCallback, useEffect, useState } from 'react';

import { MockToken__factory } from '@dopex-io/sdk';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import { useBoundStore } from 'store';

// import Slider from '@mui/material/Slider';

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

  const [amounts, setAmounts] = useState([0, 0]);
  const [, /*premium*/ setPremium] = useState(0);

  const handleAmountsRecalcuation = useCallback(() => {
    if (!treasuryData) return;
    const _amounts = treasuryData.bondCostPerDsc;

    setAmounts([
      getUserReadableAmount(_amounts[0], 18) * inputAmount,
      getUserReadableAmount(_amounts[1], 18) * inputAmount,
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
          treasuryData.tokenA.address,
          provider
        ).allowance(accountAddress, treasury),
        MockToken__factory.connect(
          treasuryData.tokenB.address,
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

  useEffect(() => {
    (async () => {
      if (!treasuryContractState.contracts || !amounts[1]) return;

      const rdpxPrice = treasuryData.rdpxPriceInAlpha;

      const nextFundingTimestamp =
        await treasuryContractState.contracts.vault.nextFundingPaymentTimestamp();

      const timeTillExpiry = nextFundingTimestamp.sub(
        Math.ceil(Number(new Date()) / 1000)
      );

      const premium =
        await treasuryContractState.contracts.vault.calculatePremium(
          rdpxPrice.sub(rdpxPrice.div(4)),
          getContractReadableAmount(amounts[1], 18),
          timeTillExpiry
        );

      setPremium(getUserReadableAmount(premium, 18));
    })();
  }, [amounts, treasuryContractState.contracts, treasuryData.rdpxPriceInAlpha]);

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
      {/* <InputRow tokenSymbol="PREM." inputAmount={premium || 0} label={'WETH'} /> */}
    </div>
  );
};

export default CollateralInputPanel;
