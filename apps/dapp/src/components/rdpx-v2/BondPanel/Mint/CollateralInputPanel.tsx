import { useCallback, useState, useEffect } from 'react';
import { MockToken__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Slider from '@mui/material/Slider';

import Typography from 'components/UI/Typography';
import InputRow from 'components/rdpx-v2/BondPanel/Mint/InputRow';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { useBoundStore } from 'store';

interface Props {
  inputAmount: number;
  setApproved: Function;
}

const CollateralInputPanel = (props: Props) => {
  const { inputAmount, setApproved } = props;

  const { accountAddress, provider, treasuryData, treasuryContractState } =
    useBoundStore();

  const [amounts, setAmounts] = useState([0, 0]);

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
      if (!treasuryContractState.contracts || !accountAddress || !amounts[0])
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
      // todo: display premium instead of amount of perpetual options

      const rdpxPrice = treasuryData.rdpxPriceInAlpha;

      const nextFundingTimestamp =
        await treasuryContractState.contracts.vault.nextFundingPaymentTimestamp();

      const timeTillExpiry = nextFundingTimestamp.sub(
        Math.ceil(Number(new Date()) / 1000)
      );

      const premium =
        await treasuryContractState.contracts.vault.calculatePremium(
          rdpxPrice.sub(rdpxPrice.div(4)),
          getContractReadableAmount(amounts[0], 18),
          timeTillExpiry
        );
      console.log(
        premium
        // .mul(getContractReadableAmount(amounts[0], 18))
        // .div(getContractReadableAmount(1, 32))
      );

      setApproved(
        rdpxAllowance.gte(getContractReadableAmount(amounts[0] || 0, 18)) &&
          wethAllowance.gte(getContractReadableAmount(amounts[1] || 0, 18))
      );
    })();
  }, [
    accountAddress,
    amounts,
    provider,
    setApproved,
    treasuryContractState.contracts,
    treasuryData,
  ]);

  return (
    <Box className="p-3 bg-umbra rounded-xl space-y-2">
      <Box className="flex space-x-1">
        <Typography variant="caption" className="my-auto">
          Collateral Required
        </Typography>
        <Tooltip
          title="rDPX / WETH cost including 25% OTM put option premium"
          arrow
        >
          <InfoOutlinedIcon className="fill-current text-stieglitz w-[0.9rem]" />
        </Tooltip>
      </Box>
      {/* <Slider
        defaultValue={50}
        aria-label="Default"
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-thumb': {
            backgroundColor: '#fff',
          },
          '& .MuiSlider-track': {
            backgroundColor: '#22E1FF',
            border: 'none',
          },
          '& .MuiSlider-rail': {
            opacity: 0.2,
            backgroundColor: '#22E1FF',
          },
        }}
      /> */}
      <InputRow
        tokenSymbol={treasuryData.tokenA.symbol}
        inputAmount={amounts[0] || 0}
        label="25%"
      />
      <InputRow
        tokenSymbol={treasuryData.tokenB.symbol}
        inputAmount={amounts[1] || 0}
        label="75%"
      />
      {/* <InputRow
        tokenSymbol="PUT"
        inputAmount={amounts[0] || 0}
        label={'OTM 25%'}
      /> */}
    </Box>
  );
};

export default CollateralInputPanel;
