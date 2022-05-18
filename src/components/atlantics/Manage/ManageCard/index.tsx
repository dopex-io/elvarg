import React, { useState, useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import Typography from 'components/UI/Typography';
import CustomInput from 'components/UI/CustomInput';
import TokenSelector from 'components/atlantics/TokenSelector';
import MaxStrikeInput from 'components/atlantics/Manage/ManageCard/MaxStrikeInput';
import PoolStats from 'components/atlantics/Manage/ManageCard/PoolStats';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/CustomButton';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

interface ManageCardProps {
  tokenId: string;
  underlying: string;
}

const ManageCard = (props: ManageCardProps) => {
  const { tokenId, underlying } = props;
  const { userAssetBalances } = useContext(AssetsContext);
  const { chainId } = useContext(WalletContext);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [selectedToken, setSelectedToken] = useState('');

  const strikesSet = false;

  const containerRef = React.useRef(null);

  const handleOpenSlider = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) => {
      setValue(e.target.value);
    },
    []
  );

  const handleMax = useCallback(() => {
    setValue(
      formatAmount(
        getUserReadableAmount(
          userAssetBalances[selectedToken || underlying] ?? '0',
          getTokenDecimals(selectedToken, chainId)
        ),
        3
      )
    );
  }, [chainId, selectedToken, underlying, userAssetBalances]);

  return (
    <Box
      className="bg-cod-gray rounded-2xl p-3 w-1/4 space-y-3"
      ref={containerRef}
    >
      <Box className="flex justify-between">
        <Typography variant="h5" className="my-auto">
          Deposit
        </Typography>
        {open && (
          <IconButton onClick={handleOpenSlider} className="p-0">
            <CloseRoundedIcon className="fill-current text-white" />
          </IconButton>
        )}
      </Box>
      {!open && (
        <>
          <Box className="bg-umbra rounded-xl w-full">
            <CustomInput
              size="small"
              variant="outlined"
              outline="umbra"
              value={value}
              onChange={handleChange}
              leftElement={
                <Box className="flex h-full my-auto">
                  <Box
                    className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1"
                    role="button"
                    onClick={handleOpenSlider}
                  >
                    <img
                      src={`/images/tokens/${(
                        selectedToken || underlying
                      ).toLowerCase()}.svg`}
                      alt={(selectedToken || underlying).toLowerCase()}
                      className="w-[2.4rem]"
                    />
                    <Typography variant="h5" className="my-auto">
                      {selectedToken || underlying}
                    </Typography>
                    <ArrowDropDownRoundedIcon className="my-auto fill-current text-mineshaft" />
                  </Box>
                  <Button
                    className="rounded-lg bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto"
                    onClick={handleMax}
                  >
                    <Typography variant="h6" className="text-stieglitz text-xs">
                      MAX
                    </Typography>
                  </Button>
                </Box>
              }
            />
          </Box>
          <MaxStrikeInput />
          <PoolStats />
          <Box className="rounded-xl bg-umbra p-3 space-y-3">
            <Box className="rounded-md bg-carbon p-3">
              <EstimatedGasCostButton gas={500000} chainId={chainId} />
            </Box>
            <Typography variant="h6" className="text-stieglitz">
              Withdrawals are locked until end of epoch 4 20 Decemeber
            </Typography>
            <CustomButton
              className="flex w-full text-center"
              color={strikesSet ? 'primary' : 'mineshaft'}
              disabled={true}
            >
              Deposit
            </CustomButton>
          </Box>
        </>
      )}
      <TokenSelector
        open={open}
        setOpen={setOpen}
        tokens={[
          {
            symbol: tokenId,
            address: '0x0000000000000000000000000000000000000000',
          },
          {
            symbol: underlying,
            address: '0x0000000000000000000000000000000000000000',
          },
        ]}
        setSelection={setSelectedToken}
        containerRef={containerRef}
      />
    </Box>
  );
};

export default ManageCard;
