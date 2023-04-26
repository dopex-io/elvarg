import { useCallback, useEffect, useState } from 'react';

import { BigNumber, utils } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import { Box, Input as MuiInput } from '@mui/material';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { CustomButton } from 'components/UI';
import Loading from 'components/zdte/Loading';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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
    <div className="flex justify-between p-2">
      <h6 className="text-stieglitz">
        <span>Balance</span>
      </h6>
      <div className="ml-auto mr-2 mt-1 cursor-pointer" onClick={handleMax}>
        <img src="/assets/max.svg" alt="MAX" />
      </div>
      <h6 className="flex justify-end">
        <span>{`${formatAmount(tokenBalance, 2)}`}</span>
        <span className="text-stieglitz ml-1">{tokenSymbol}</span>
      </h6>
    </div>
  );
};

const Deposit = () => {
  const sendTx = useSendTx();

  const {
    signer,
    provider,
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
  const [isQuoteApproved, setIsQuoteApproved] = useState(false);
  const [isBaseApproved, setIsBaseApproved] = useState(false);

  const handleApprove = useCallback(async () => {
    if (!signer || !staticZdteData || !accountAddress) return;

    try {
      const tokenContract = await ERC20__factory.connect(
        isQuote
          ? staticZdteData?.quoteTokenAddress
          : staticZdteData?.baseTokenAddress,
        signer
      );

      await sendTx(tokenContract, 'approve', [
        staticZdteData?.zdteAddress,
        getContractReadableAmount(
          amount,
          isQuote ? DECIMALS_USD : DECIMALS_TOKEN
        ),
      ]);
      const allowance: BigNumber = await tokenContract.allowance(
        accountAddress,
        staticZdteData?.zdteAddress
      );
      const depositAmount = getContractReadableAmount(
        amount,
        isQuote ? DECIMALS_USD : DECIMALS_TOKEN
      );
      if (isQuote) {
        setIsQuoteApproved(allowance.gt(0) && allowance.gte(depositAmount));
      } else {
        setIsBaseApproved(allowance.gt(0) && allowance.gte(depositAmount));
      }
    } catch (err) {
      console.log(err);
    }
  }, [signer, sendTx, staticZdteData, isQuote, amount, accountAddress]);

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

  const checkApproved = useCallback(async () => {
    if (!accountAddress || !signer || !staticZdteData) return;

    const tokenContract = await ERC20__factory.connect(
      isQuote
        ? staticZdteData?.quoteTokenAddress
        : staticZdteData?.baseTokenAddress,
      signer
    );
    const allowance: BigNumber = await tokenContract.allowance(
      accountAddress,
      staticZdteData?.zdteAddress
    );
    const depositAmount = getContractReadableAmount(
      amount,
      isQuote ? DECIMALS_USD : DECIMALS_TOKEN
    );
    if (isQuote) {
      setIsQuoteApproved(allowance.gt(0) && allowance.gte(depositAmount));
    } else {
      setIsBaseApproved(allowance.gt(0) && allowance.gte(depositAmount));
    }
  }, [accountAddress, signer, staticZdteData, amount, isQuote]);

  const approved = isQuote ? isQuoteApproved : isBaseApproved;

  // Updates approved state and user balance
  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  if (!staticZdteData) {
    return <Loading />;
  }

  return (
    <Box className="rounded-xl space-y-2 p-2">
      <Box className="rounded-xl">
        <Box className="flex flex-row justify-between">
          <Box className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <h6
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  !isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(true)}
              >
                <span>{staticZdteData?.quoteTokenSymbol}</span>
              </h6>
            </Box>
            <Box className="flex flex-row h-10 w-auto p-1 pr-3 pl-2">
              <h6
                className={cx(
                  'font-medium mt-1 cursor-pointer text-[0.8rem]',
                  isQuote && 'opacity-50'
                )}
                onClick={() => setisQuote(false)}
              >
                <span>{staticZdteData?.baseTokenSymbol}</span>
              </h6>
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
      <div className="p-1 ml-1">
        <span className="text-sm text-white">
          {isQuote
            ? `Deposit ${staticZdteData.quoteTokenSymbol} to provide liquidity for put options`
            : `Deposit ${staticZdteData.baseTokenSymbol} to provide liquidity for call options`}
        </span>
      </div>
      <CustomButton
        size="medium"
        className="w-full mt-5 !rounded-md"
        color={
          !approved || (Number(amount) > 0 && Number(amount) <= assetBalance)
            ? 'primary'
            : 'mineshaft'
        }
        disabled={Number(amount) <= 0 || Number(amount) > assetBalance}
        onClick={!approved ? handleApprove : handleOpenPosition}
      >
        {approved
          ? amount == 0
            ? 'Insert an amount'
            : Number(amount) > assetBalance
            ? 'Insufficient balance'
            : 'Deposit'
          : 'Approve'}
      </CustomButton>
    </Box>
  );
};

export default Deposit;
