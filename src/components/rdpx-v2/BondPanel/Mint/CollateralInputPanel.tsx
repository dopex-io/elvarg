import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import Typography from 'components/UI/Typography';
import InputRow from 'components/rdpx-v2/BondPanel/Mint/InputRow';

// import { useBoundStore } from 'store';

interface Props {
  setAmounts: (
    amounts: [BigNumber, BigNumber, BigNumber],
    index: number
  ) => void;
  // setter for 'amounts' of type [BigNumber, BigNumber, BigNumber]
  // rdpx, alpha token, ap amounts
}

const RequiredCollatPanel = (props: Props) => {
  // const { userAssetBalances } = useBoundStore();
  const { setAmounts } = props;

  const handleAmountsRecalcuation = useCallback(() => {
    setAmounts([BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)], 0);
  }, [setAmounts]);

  return (
    <Box className="p-3 bg-umbra rounded-xl space-y-2">
      <Typography variant="caption">Collateral Required</Typography>
      <Slider
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
      />
      <InputRow
        tokenSymbol={'RDPX'}
        inputAmount={'0'}
        handleChangeRecalculation={handleAmountsRecalcuation}
        percentageReq={'25'}
        index={0}
      />
      <InputRow
        tokenSymbol={'USDC'}
        inputAmount={'0'}
        handleChangeRecalculation={handleAmountsRecalcuation}
        percentageReq={'75'}
        index={1}
      />
      <InputRow
        tokenSymbol={'APP'}
        inputAmount={'0'}
        handleChangeRecalculation={handleAmountsRecalcuation}
        percentageReq={'25'}
        index={2}
      />
    </Box>
  );
};

export default RequiredCollatPanel;
