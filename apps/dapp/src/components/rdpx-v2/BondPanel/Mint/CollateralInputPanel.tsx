import { useCallback, useState, useEffect } from 'react';
import { MockToken__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
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

const RequiredCollatPanel = (props: Props) => {
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
      if (!treasuryContractState.contracts || !accountAddress) return;

      const treasury = treasuryContractState.contracts.treasury.address;

      if (!treasuryData.tokenA.address || treasuryData.tokenB.address) return;

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
      <Typography variant="caption">Collateral Required</Typography>
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
      <InputRow
        tokenSymbol="APP"
        inputAmount={amounts[0] || 0}
        label={'OTM 25%'}
      />
    </Box>
  );
};

export default RequiredCollatPanel;
