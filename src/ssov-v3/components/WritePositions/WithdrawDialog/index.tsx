import { useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { utils as ethersUtils } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovV3Context, WritePositionInterface } from 'contexts/SsovV3';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

export interface Props {
  open: boolean;
  handleClose: () => void;
  data: WritePositionInterface;
}

const Stat = ({ name, value }: { name: string; value: string }) => {
  return (
    <Box className="flex flex-row justify-between">
      <Typography variant="h6" component="div" className="text-stieglitz">
        {name}
      </Typography>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
    </Box>
  );
};

const WithdrawDialog = ({ open, handleClose, data }: Props) => {
  const { ssovData, selectedSsovV3, ssovSigner } = useContext(SsovV3Context);
  const { accountAddress } = useContext(WalletContext);

  const sendTx = useSendTx();

  const handleWithdraw = useCallback(async () => {
    await sendTx(
      ssovSigner.ssovContractWithSigner.withdraw(data.tokenId, accountAddress)
    );
  }, [accountAddress, data, sendTx, ssovSigner]);

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
          <Stat name="Asset" value={ssovData.tokenName} />
          <Stat name="Collateral" value={ssovData.tokenName} />
          <Stat name="Type" value={selectedSsovV3.type} />
          <Stat
            name="Strike Price"
            value={`$${getUserReadableAmount(data.strike, 8)}`}
          />
          <Stat
            name="Deposit Amount"
            value={`${getUserReadableAmount(data.collateralAmount, 18)} ${
              ssovData.tokenName
            }`}
          />
          <Stat
            name="Accrued Premiums"
            value={`${getUserReadableAmount(data.accruedPremiums, 18)} ${
              ssovData.tokenName
            }`}
          />
          <Stat
            name="Accrued Rewards"
            value={`${ethersUtils.formatEther(data.accruedRewards[0])} DPX`}
          />
          <Stat name="Epoch" value={data.epoch.toString()} />
        </Box>
        <CustomButton
          className="w-full my-4"
          onClick={handleWithdraw}
          disabled={!ssovData.isCurrentEpochExpired}
          size="xl"
        >
          Withdraw
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default WithdrawDialog;
