import { useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import NumberDisplay from 'components/UI/NumberDisplay';
import Stat from '../Stat';

import { useBoundStore } from 'store';
import { WritePositionInterface } from 'store/Vault/ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

export interface Props {
  open: boolean;
  handleClose: () => void;
  data: WritePositionInterface;
}

const WithdrawDialog = ({ open, handleClose, data }: Props) => {
  const { accountAddress, ssovData, ssovSigner, updateSsovV3EpochData } =
    useBoundStore();

  const sendTx = useSendTx();

  const handleWithdraw = useCallback(async () => {
    if (!ssovSigner.ssovContractWithSigner || !accountAddress) return;
    await sendTx(ssovSigner.ssovContractWithSigner, 'withdraw', [
      data.tokenId,
      accountAddress,
    ]);
    updateSsovV3EpochData();
  }, [accountAddress, data, sendTx, ssovSigner, updateSsovV3EpochData]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton
            className="p-0 pr-3 pb-1"
            onClick={handleClose}
            size="large"
          >
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Withdraw</Typography>
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col p-4 space-y-4">
          <Stat name="Asset" value={ssovData?.underlyingSymbol} />
          <Stat name="Collateral" value={ssovData?.collateralSymbol} />
          <Stat name="Type" value={ssovData?.isPut ? 'PUT' : 'CALL'} />
          <Stat
            name="Strike Price"
            value={`$${getUserReadableAmount(data.strike, 8)}`}
          />
          <Stat
            name="Deposit Amount"
            value={`${getUserReadableAmount(data.collateralAmount, 18)} ${
              ssovData?.collateralSymbol
            }`}
          />
          <Stat
            name="Accrued Premiums"
            value={
              <>
                <NumberDisplay n={data.accruedPremiums} decimals={18} />{' '}
                {ssovData?.collateralSymbol}
              </>
            }
          />
          <Stat
            name="Accrued Rewards"
            value={
              <>
                {data.accruedRewards.map((rewards, index) => {
                  return (
                    <NumberDisplay key={index} n={rewards} decimals={18} />
                  );
                })}
              </>
            }
          />
          <Stat name="Epoch" value={data.epoch.toString()} />
        </Box>
        <CustomButton
          className="w-full my-4"
          onClick={handleWithdraw}
          size="large"
        >
          Withdraw
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default WithdrawDialog;
