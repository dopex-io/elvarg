import React, { useState, useCallback, useContext, useMemo } from 'react';
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

import LockerIcon from 'svgs/icons/LockerIcon';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';
import { AtlanticsContext } from 'contexts/Atlantics';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

interface ManageCardProps {
  tokenId: string;
  underlying: string;
  poolType: string;
}

const ManageCard = (props: ManageCardProps) => {
  const { tokenId, underlying, poolType } = props;

  const { userAssetBalances } = useContext(AssetsContext);
  const { chainId } = useContext(WalletContext);
  const { selectedPool } = useContext(AtlanticsContext);

  const pool = useMemo(() => {
    if (!selectedPool) return;
    return selectedPool;
  }, [selectedPool]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | string>('');
  const [selectedToken, setSelectedToken] = useState(
    pool?.tokens.deposit ?? 'T'
  );
  const strikesSet = false;

  const containerRef = React.useRef(null);

  const handleOpenSlider = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(e.target.value);
    },
    []
  );

  const handleMax = useCallback(() => {
    setValue(
      getUserReadableAmount(
        userAssetBalances[selectedToken || underlying] ?? '0',
        getTokenDecimals(selectedToken, chainId)
      )
    );
  }, [chainId, selectedToken, underlying, userAssetBalances]);

  return (
    <Box
      className="flex flex-col bg-cod-gray rounded-2xl p-3 space-y-3 h-full"
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
                      src={`/images/tokens/${selectedToken.toLowerCase()}.svg`}
                      alt={(selectedToken || underlying).toLowerCase()}
                      className="w-[2.4rem]"
                    />
                    <Typography variant="h5" className="my-auto">
                      {selectedToken}
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
          <PoolStats poolType={poolType} />
          <Box className="rounded-xl bg-umbra p-3 space-y-3">
            <Box className="rounded-md bg-carbon p-3">
              <EstimatedGasCostButton gas={500000} chainId={chainId} />
            </Box>
            <Box className="flex">
              <LockerIcon className="my-auto m-2" />
              <Typography variant="h6" className="text-stieglitz">
                Withdrawals are locked until end of Epoch{' '}
                <>{selectedPool?.state?.epoch.toString()}</>
              </Typography>
            </Box>
            <CustomButton
              className="flex w-full text-center"
              color={strikesSet ? 'primary' : 'mineshaft'}
              disabled={!selectedPool?.state.isVaultReady}
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
            symbol: pool?.tokens.deposit!,
            address: pool?.contracts?.quoteToken.address!,
          },
        ]}
        setSelection={setSelectedToken}
        containerRef={containerRef}
      />
    </Box>
  );
};

export default ManageCard;
