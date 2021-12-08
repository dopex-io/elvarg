import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BigNumber, utils as ethersUtils } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import { SsovContext, SsovProperties } from 'contexts/Ssov';

import sendTx from 'utils/contracts/sendTx';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';

export interface Props {
  open: boolean;
  handleClose: () => {};
  strikeIndex: number;
  ssovProperties: SsovProperties;
}

const Transfer = ({
  open,
  handleClose,
  strikeIndex,
  ssovProperties,
}: Props) => {
  const {
    updateSsovData,
    updateUserSsovData,
    selectedSsov,
    ssovDataArray,
    userSsovDataArray,
  } = useContext(SsovContext);
  const { accountAddress, signer } = useContext(WalletContext);

  const [transferAmount, setTransferAmount] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [userEpochStrikeTokenBalance, setUserEpochStrikeTokenBalance] =
    useState<number>(0);

  const { selectedEpoch } = ssovProperties;
  const { epochStrikes } = ssovDataArray[selectedSsov];
  const { epochStrikeTokens } = userSsovDataArray[selectedSsov];
  const strikePrice = getUserReadableAmount(epochStrikes[strikeIndex] ?? 0, 8);
  const epochStrikeToken = epochStrikeTokens[strikeIndex];

  const error = useMemo(() => {
    let errorMessage;
    let recipientAddress = recipient.toLocaleLowerCase();
    let _transferAmount = transferAmount.toString();
    if (recipient !== '') {
      try {
        ethersUtils.getIcapAddress(recipientAddress);
      } catch (err) {
        errorMessage = 'Invalid address, please double check.';
      }
    }
    if (_transferAmount !== '' || _transferAmount > '0') {
      if (_transferAmount > userEpochStrikeTokenBalance.toString()) {
        errorMessage = 'Transfer amount exceeds balance';
      }
    }
    return errorMessage;
  }, [recipient, transferAmount, userEpochStrikeTokenBalance]);

  const updateUserEpochStrikeTokenBalance = useCallback(async () => {
    if (!epochStrikeToken || !accountAddress) {
      setUserEpochStrikeTokenBalance(0);
      return;
    }
    const userEpochStrikeTokenBalance = await epochStrikeToken.balanceOf(
      accountAddress
    );
    setUserEpochStrikeTokenBalance(
      getUserReadableAmount(userEpochStrikeTokenBalance, 18)
    );
  }, [epochStrikeToken, accountAddress]);

  const handleRecipientChange = useCallback((e) => {
    setRecipient(e.target.value.toString());
  }, []);

  const handleAmountChange = useCallback((e) => {
    setTransferAmount(e.target.value.toString());
  }, []);

  const handleMax = useCallback(() => {
    setTransferAmount(userEpochStrikeTokenBalance);
  }, [userEpochStrikeTokenBalance]);

  const handleTransfer = useCallback(() => {
    if (!accountAddress || !epochStrikeToken) return;
    try {
      sendTx(
        epochStrikeToken.connect(signer).transfer(accountAddress, recipient)
      );
      updateSsovData();
      updateUserSsovData();
      updateUserEpochStrikeTokenBalance();
      setTransferAmount(0);
      setRecipient('');
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    epochStrikeToken,
    recipient,
    updateSsovData,
    updateUserEpochStrikeTokenBalance,
    updateUserSsovData,
    signer,
  ]);

  useEffect(() => {
    updateUserEpochStrikeTokenBalance();
  }, [updateUserEpochStrikeTokenBalance]);
  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton className="p-0 pr-3 pb-1" onClick={handleClose}>
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Transfer</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" className="text-stieglitz mb-2">
            Balance: {userEpochStrikeTokenBalance.toString()}
          </Typography>
          <Typography
            variant="h6"
            className="text-wave-blue uppercase mb-2 mr-2"
            role="button"
            onClick={handleMax}
          >
            Max
          </Typography>
        </Box>
        <Box className="bg-umbra rounded-md flex flex-col p-4">
          <Box className="flex flex-row justify-between">
            <Box className="h-12 bg-cod-gray rounded-xl p-3 flex flex-row space-x-2 w-24 justify-center items-center">
              <img
                className="flex"
                src={SSOV_MAP[ssovProperties.tokenName].imageSrc}
                alt={ssovProperties.tokenName}
              />
              <Box className="text-stieglitz flex">
                {ssovProperties.tokenName}
              </Box>
            </Box>
            <Input
              disableUnderline={true}
              id="amount"
              name="amount"
              value={transferAmount}
              onChange={handleAmountChange}
              placeholder="0"
              type="number"
              className="h-12 text-2xl text-white ml-2"
              classes={{ input: 'text-right' }}
            />
          </Box>
          <Box className="flex flex-col">
            <Box className="flex flex-row justify-between mt-3">
              <Typography
                variant="caption"
                component="div"
                className="text-stieglitz"
              >
                Strike Price
              </Typography>
              <Typography variant="caption">
                ${formatAmount(strikePrice, 5)}
              </Typography>
            </Box>
          </Box>
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
          disabled={
            transferAmount > 0 && recipient !== '' && error === undefined
              ? false
              : true
          }
        >
          Transfer
        </CustomButton>
        <Box className="flex flex-row justify-between mt-4">
          <Typography variant="h6" className="text-stieglitz">
            Epoch {selectedEpoch}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Transfer;
