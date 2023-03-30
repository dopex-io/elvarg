import { FC, useCallback, useEffect, useState } from 'react';

import { BigNumber, utils } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import { Box, CircularProgress, Input as MuiInput } from '@mui/material';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { CustomButton, Typography } from 'components/UI';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD, MAX_VALUE } from 'constants/index';

interface DepositProps {}

const BalanceBox = ({
  tokenSymbol,
  tokenBalance,
  handleMax,
}: {
  tokenSymbol: string;
  tokenBalance: number;
  handleMax: () => void;
}) => {
  return (
    <Box className="flex justify-between p-2">
      <Typography variant="h6" color="stieglitz">
        Balance
      </Typography>
      <Box className="ml-auto mr-2 mt-1 cursor-pointer" onClick={handleMax}>
        <img src="/assets/max.svg" alt="MAX" />
      </Box>
      <Typography variant="h6" className="flex justify-end">
        {`${formatAmount(tokenBalance, 2)}`}
        <span className="text-stieglitz ml-1">{tokenSymbol}</span>
      </Typography>
    </Box>
  );
};

const Deposit: FC<DepositProps> = ({}) => {
  const sendTx = useSendTx();

  const {
    signer,
    provider,
    zdteData,
    staticZdteData,
    accountAddress,
    getZdteContract,
    updateZdteData,
    userZdteLpData,
  } = useBoundStore();

  const [isQuote, setisQuote] = useState(true);
  const assetBalance = isQuote
    ? getUserReadableAmount(
        userZdteLpData?.userQuoteTokenBalance!,
        DECIMALS_USD
      )
    : getUserReadableAmount(
        userZdteLpData?.userBaseTokenBalance!,
        DECIMALS_TOKEN
      );

  const zdteContract = getZdteContract();

  const [amount, setAmount] = useState<string | number>(0);
  const [approved, setApproved] = useState<boolean>(false);

  const handleApprove = useCallback(async () => {
    if (!signer || !staticZdteData) return;

    try {
      await sendTx(
        ERC20__factory.connect(
          isQuote
            ? staticZdteData?.quoteTokenAddress
            : staticZdteData?.baseTokenAddress,
          signer
        ),
        'approve',
        [staticZdteData?.zdteAddress, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, staticZdteData, isQuote]);

  useEffect(() => {
    (async () => {
      if (!signer || !accountAddress || !staticZdteData) return;
      try {
        const baseTokenContract = await ERC20__factory.connect(
          isQuote
            ? staticZdteData?.quoteTokenAddress
            : staticZdteData?.baseTokenAddress,
          signer
        );
        const allowance: BigNumber = await baseTokenContract.allowance(
          accountAddress,
          staticZdteData?.zdteAddress
        );
        setApproved(
          allowance.gte(
            getContractReadableAmount(
              amount,
              isQuote ? DECIMALS_USD : DECIMALS_TOKEN
            )
          )
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [signer, accountAddress, amount, staticZdteData, isQuote]);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setAmount(e.target.value),
    []
  );

  const handleMax = useCallback(() => {
    if (isQuote) {
      setAmount(utils.formatEther(userZdteLpData?.userQuoteTokenBalance!));
    } else {
      setAmount(utils.formatEther(userZdteLpData?.userBaseTokenBalance!));
    }
  }, [userZdteLpData, isQuote]);

  const handleOpenPosition = useCallback(async () => {
    if (!signer || !provider || !zdteContract) return;
    try {
      await sendTx(zdteContract.connect(signer), 'deposit', [
        isQuote,
        isQuote
          ? getContractReadableAmount(amount, DECIMALS_USD)
          : getContractReadableAmount(amount, DECIMALS_TOKEN),
      ]).then(() => {
        setAmount('0');
      });
      await updateZdteData();
    } catch (e) {
      console.log('fail to deposit', e);
    }
  }, [signer, provider, zdteContract, amount, updateZdteData, sendTx, isQuote]);

  if (!zdteData || !userZdteLpData || !staticZdteData) {
    return (
      <Box className="absolute left-[49%] top-[49%]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="rounded-xl space-y-2 p-2">
      <Box className="rounded-xl">
        <Box className="flex flex-row justify-between">
          <Box className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  !isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(true)}
              >
                {staticZdteData?.quoteTokenSymbol}
              </Typography>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <Typography
                variant="h6"
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(false)}
              >
                {staticZdteData?.baseTokenSymbol}
              </Typography>
            </Box>
          </Box>
          <MuiInput
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-md text-white font-mono mr-2"
            value={amount}
            onChange={handleDepositAmount}
            classes={{ input: 'text-right' }}
          />
        </Box>
      </Box>
      <BalanceBox
        tokenSymbol={
          isQuote
            ? staticZdteData.quoteTokenSymbol
            : staticZdteData.baseTokenSymbol
        }
        tokenBalance={assetBalance}
        handleMax={handleMax}
      />
      <CustomButton
        size="medium"
        className="w-full mt-5 !rounded-md"
        color={
          !approved || (amount > 0 && amount <= assetBalance)
            ? 'primary'
            : 'mineshaft'
        }
        disabled={amount <= 0 || amount > assetBalance}
        onClick={!approved ? handleApprove : handleOpenPosition}
      >
        {approved
          ? amount == 0
            ? 'Insert an amount'
            : amount > assetBalance
            ? 'Insufficient balance'
            : 'Deposit'
          : 'Approve'}
      </CustomButton>
    </Box>
  );
};

export default Deposit;