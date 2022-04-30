import { useCallback, useContext, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { utils as ethersUtils } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import Stat from '../Stat';

import { WalletContext } from 'contexts/Wallet';
import { SsovV3Context, WritePositionInterface } from 'contexts/SsovV3';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';
import NumberDisplay from 'components/UI/NumberDisplay';

export interface Props {
  open: boolean;
  handleClose: () => void;
  data: WritePositionInterface;
}

const TransferDialog = ({ open, handleClose, data }: Props) => {
  const { ssovData, selectedSsovV3, ssovSigner } = useContext(SsovV3Context);
  const { accountAddress } = useContext(WalletContext);

  const sendTx = useSendTx();

  const [recipient, setRecipient] = useState('');

  const error = useMemo(() => {
    let _error;
    let recipientAddress = recipient.toLocaleLowerCase();
    if (recipient !== '') {
      try {
        ethersUtils.getIcapAddress(recipientAddress);
      } catch (err) {
        _error = 'Invalid address';
      }
      if (recipient.toLowerCase() === accountAddress.toLowerCase()) {
        _error = 'Wallet address cannot be recipient';
      }
    }

    return _error;
  }, [recipient, accountAddress]);

  const handleRecipientChange = useCallback((e) => {
    setRecipient(e.target.value.toString());
  }, []);

  const handleTransfer = useCallback(async () => {
    await sendTx(
      ssovSigner.ssovContractWithSigner[
        'safeTransferFrom(address,address,uint256)'
      ](accountAddress, recipient, data.tokenId)
    );
  }, [accountAddress, data, recipient, sendTx, ssovSigner]);

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
          <Typography variant="h3">Transfer</Typography>
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
            value={
              <>
                <NumberDisplay n={data.accruedPremiums} decimals={18} />{' '}
                {ssovData.tokenName}
              </>
            }
          />
          <Stat
            name="Accrued Rewards"
            value={
              <>
                <NumberDisplay n={data.accruedRewards[0]} decimals={18} /> DPX
              </>
            }
          />
          <Stat name="Epoch" value={data.epoch.toString()} />
        </Box>
        {error !== undefined && (
          <Box className="m-4 border-2 p-3 bg-opacity-10 border-red-700 bg-red-500 rounded-md border-opacity-50">
            <Typography
              variant="caption"
              component="div"
              className="text-center text-md text-red-400"
            >
              {error}
            </Typography>
          </Box>
        )}
        <Box
          className={`${
            !error && 'mt-4'
          } bg-umbra flex flex-row p-4 rounded-xl justify-between mb-4 w-full`}
        >
          <Input
            disableUnderline={true}
            id="address"
            name="recipientAddress"
            onChange={handleRecipientChange}
            value={recipient}
            type="text"
            className="h-8 text-sm text-white"
            placeholder="Enter recipient address"
            fullWidth
          />
        </Box>
        <CustomButton
          className="w-full mb-4"
          onClick={handleTransfer}
          size="xl"
          disabled={recipient !== '' && error === undefined ? false : true}
        >
          Transfer
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default TransferDialog;
