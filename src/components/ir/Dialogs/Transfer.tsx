import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { utils as ethersUtils } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { useWalletStore } from 'store/Wallet';
import { AssetsContext } from 'contexts/Assets';
import { RateVaultContext } from 'contexts/RateVault';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

export interface Props {
  setTokenAddressToTransfer: Function;
  tokenAddressToTransfer: string | null;
}

const Transfer = ({
  setTokenAddressToTransfer,
  tokenAddressToTransfer,
}: Props) => {
  const { accountAddress, signer } = useWalletStore();
  const { updateAssetBalances } = useContext(AssetsContext);
  const rateVaultContext = useContext(RateVaultContext);
  const { updateRateVaultUserData } = rateVaultContext;

  const [transferAmount, setTransferAmount] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (tokenAddressToTransfer) {
        if (!signer || !accountAddress) return;

        const amount = await ERC20__factory.connect(
          tokenAddressToTransfer,
          signer
        ).balanceOf(accountAddress);
        setTokenBalance(getUserReadableAmount(amount, 18));
      }
    })();
  }, [tokenAddressToTransfer, signer, accountAddress]);

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
      if (_transferAmount > tokenBalance.toString()) {
        errorMessage = 'Transfer amount exceeds balance';
      }
    }
    return errorMessage;
  }, [recipient, transferAmount, tokenBalance]);

  // @ts-ignore TODO: FIX
  const handleRecipientChange = useCallback((e) => {
    setRecipient(e.target.value.toString());
  }, []);

  // @ts-ignore TODO: FIX
  const handleAmountChange = useCallback((e) => {
    setTransferAmount(e.target.value.toString());
  }, []);

  const handleMax = useCallback(() => {
    setTransferAmount(tokenBalance.toString());
  }, [tokenBalance]);

  const handleTransfer = useCallback(() => {
    if (!tokenAddressToTransfer || !signer) return;

    ERC20__factory.connect(tokenAddressToTransfer, signer).transfer(
      recipient,
      getContractReadableAmount(transferAmount, 18)
    );
    updateAssetBalances();
    updateRateVaultUserData();
  }, [
    recipient,
    signer,
    transferAmount,
    updateAssetBalances,
    updateRateVaultUserData,
    tokenAddressToTransfer,
  ]);

  return (
    <Dialog
      open={tokenAddressToTransfer !== null}
      handleClose={() => setTokenAddressToTransfer(null)}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton
            className="p-0 pr-3 pb-1"
            onClick={() => setTokenAddressToTransfer(null)}
            size="large"
          >
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Transfer</Typography>
        </Box>
        <Box className="flex justify-between">
          <Typography variant="h6" className="text-stieglitz mb-2">
            Balance: {formatAmount(tokenBalance, 6)}
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
            <Box className="h-12 bg-cod-gray rounded-xl p-2 flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8">
                <img src={'/assets/2pool.svg'} alt={'2Pool'} />
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

export default Transfer;
