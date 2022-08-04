import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import { format } from 'date-fns';
import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { StraddlesContext } from 'contexts/Straddles';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import RollIcon from 'svgs/icons/RollIcon';
import ArrowUpDownIcon from 'svgs/icons/ArrowsUpDownIcon';
import CalculatorIcon from 'svgs/icons/CalculatorIcon';

import formatAmount from 'utils/general/formatAmount';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { MAX_VALUE } from 'constants/index';

const Manage = () => {
  const { chainId, accountAddress, signer, contractAddresses } =
    useContext(WalletContext);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [activeTab, setActiveTab] = useState<string>('Deposit');
  const {
    straddlesEpochData,
    selectedEpoch,
    straddlesData,
    straddlesUserData,
    updateStraddlesEpochData,
    updateStraddlesUserData,
  } = useContext(StraddlesContext);

  const sendTx = useSendTx();

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('1');

  const totalUSDDeposit = useMemo(() => {
    let total = BigNumber.from('0');

    straddlesUserData?.writePositions?.map((position) => {
      total = total.add(position.usdDeposit);
    });

    return total;
  }, [straddlesUserData]);

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const open2CRV = () => {
    window.open('https://arbitrum.curve.fi/2pool', '_blank');
  };

  const readableExpiry = useMemo(() => {
    if (straddlesEpochData?.expiry.gt(10000000000))
      return format(
        getUserReadableAmount(straddlesEpochData?.expiry!, 0),
        'd LLL YYY'
      );
    else return '-';
  }, [straddlesEpochData]);

  const vaultShare = useMemo(() => {
    if (!straddlesEpochData) return 0;
    return (
      (getUserReadableAmount(totalUSDDeposit, 6) /
        getUserReadableAmount(straddlesEpochData.usdDeposits, 6)) *
        100 || 0
    );
  }, [straddlesEpochData, totalUSDDeposit]);

  const futureVaultShare = useMemo(() => {
    if (!straddlesEpochData) return 0;
    let share =
      (getUserReadableAmount(
        totalUSDDeposit.add(getContractReadableAmount(amount, 6)),
        6
      ) /
        getUserReadableAmount(
          straddlesEpochData.usdDeposits.add(
            getContractReadableAmount(amount, 6)
          ),
          6
        )) *
      100;

    return formatAmount(Math.min(share, 100), 0);
  }, [straddlesEpochData, amount, totalUSDDeposit]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    if (
      !straddlesData ||
      !accountAddress ||
      !signer ||
      !updateStraddlesEpochData ||
      !updateStraddlesUserData
    )
      return;
    try {
      await sendTx(
        straddlesData.straddlesContract
          .connect(signer)
          .deposit(getContractReadableAmount(amount, 6), true, accountAddress)
      );
      await updateStraddlesUserData();
      await updateStraddlesEpochData();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    straddlesData,
    signer,
    amount,
    updateStraddlesUserData,
    updateStraddlesEpochData,
    sendTx,
  ]);

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    if (
      !straddlesData ||
      !accountAddress ||
      !signer ||
      !updateStraddlesEpochData ||
      !updateStraddlesUserData
    )
      return;

    try {
      await sendTx(
        straddlesData.straddlesContract
          .connect(signer)
          .purchase(getContractReadableAmount(amount, 18), accountAddress)
      );
      await updateStraddlesUserData();
      await updateStraddlesEpochData();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    straddlesData,
    signer,
    sendTx,
    straddlesEpochData,
    amount,
    updateStraddlesUserData,
    updateStraddlesEpochData,
  ]);

  const handleApprove = useCallback(async () => {
    if (!straddlesData || !signer || !contractAddresses) return;
    try {
      await sendTx(
        ERC20__factory.connect(straddlesData.usd, signer).approve(
          straddlesData.straddlesContract.address,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, straddlesData, contractAddresses]);

  const totalCost = useMemo(() => {
    if (!straddlesEpochData?.currentPrice) return BigNumber.from('0');

    return getContractReadableAmount(amount, 18).mul(
      straddlesEpochData?.currentPrice
    );
  }, [amount, straddlesEpochData]);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !straddlesData) return;

      const finalAmount: BigNumber = getContractReadableAmount(amount, 6);
      const token = ERC20__factory.connect(straddlesData.usd, signer);
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        straddlesData?.straddlesContract?.address
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    contractAddresses,
    accountAddress,
    approved,
    amount,
    signer,
    chainId,
    straddlesData,
  ]);

  return (
    <Box className="bg-cod-gray rounded-xl p-3 max-w-sm">
      <Box className={'flex'}>
        <Box className={'w-full'}>
          <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
            <Box
              className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
                activeTab === 'Deposit' ? 'bg-[#2D2D2D]' : ''
              }`}
              onClick={() => setActiveTab('Deposit')}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Deposit
              </Typography>
            </Box>
            <Box
              className={`text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80 ${
                activeTab === 'Purchase' ? 'bg-[#2D2D2D]' : ''
              }`}
              onClick={() => setActiveTab('Purchase')}
            >
              <Typography variant="h6" className="text-xs font-normal">
                Purchase
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {activeTab === 'Deposit' ? (
        <Box>
          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex flex-row justify-between">
              <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
                <Box className="flex flex-row h-10 w-[100px] p-1">
                  <img src={'/images/tokens/usdc.svg'} alt={'USDC'} />
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-md font-medium pl-1 pt-1.5 ml-1.5"
                  >
                    <span className="text-white">USDC</span>
                  </Typography>
                </Box>
              </Box>
              <Input
                disableUnderline
                id="notionalSize"
                name="notionalSize"
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                value={rawAmount}
                onChange={(e) => setRawAmount(e.target.value)}
                classes={{ input: 'text-right' }}
              />
            </Box>
            <Box className="flex flex-row justify-between">
              <Box className="flex">
                <Typography variant="h6" className="text-sm pl-1 pt-2">
                  <span className="text-stieglitz">Balance</span>
                </Typography>
              </Box>
              <Box className="ml-auto mr-0">
                <Typography
                  variant="h6"
                  className="text-stieglitz text-sm pl-1 pt-2 pr-3"
                >
                  {formatAmount(getUserReadableAmount(userTokenBalance, 6), 2)}{' '}
                  USDC
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="mt-4 flex justify-center">
            <Box className="py-2 w-full rounded-tl-lg border border-neutral-800">
              <Typography variant="h6" className="mx-2 text-white">
                {formatAmount(getUserReadableAmount(totalUSDDeposit, 6), 2)}{' '}
                {'->'}{' '}
                {formatAmount(
                  getUserReadableAmount(totalUSDDeposit, 6) + amount,
                  2
                )}
              </Typography>
              <Typography variant="h6" className="mx-2 text-neutral-400">
                Deposit
              </Typography>
            </Box>
            <Box className="py-2 w-full rounded-tr-lg border border-neutral-800">
              <Typography variant="h6" className="mx-2 text-white">
                {formatAmount(vaultShare, 1)}% {'->'}{' '}
                {formatAmount(futureVaultShare, 1)}%
              </Typography>
              <Typography variant="h6" className="mx-2 text-neutral-400">
                Vault Share
              </Typography>
            </Box>
          </Box>
          <Box className="py-2 w-full flex items-center justify-between rounded-b-lg border border-t-0 border-neutral-800">
            <Box className="">
              <Typography variant="h6" className="mx-2 text-neutral-400">
                Next Epoch
                <HelpOutlineIcon className="h-4 mb-1" />
              </Typography>
              <Typography variant="h6" className="mx-2 mt-2 text-neutral-400">
                Withdrawable
                <HelpOutlineIcon className="h-4 mb-1" />
              </Typography>
            </Box>
            <Box className="">
              <Typography variant="h6" className="mx-2  text-white">
                {readableExpiry}
              </Typography>
              <Typography variant="h6" className="mx-2 mt-2 text-white">
                {readableExpiry}
              </Typography>
            </Box>
          </Box>
          <Box className="my-4 w-full rounded-lg border border-neutral-800">
            <Box className="flex justify-start items-center mx-2">
              <RollIcon className="w-4 h-4" />
              <Typography variant="h6" className="mx-2 py-2">
                Auto Rollover Configured
              </Typography>
            </Box>
            <Typography variant="h6" className="mx-2 pb-2 text-gray-400">
              This vault roll deposits over between epochs. This can be
              cancelled after depositing.
            </Typography>
          </Box>
          <Box className="rounded-lg bg-neutral-800">
            <Box className="p-3">
              <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
                <EstimatedGasCostButton gas={5000000} chainId={chainId} />
              </Box>
              <Box
                className="bg-mineshaft rounded-md flex items-center pr-2 pl-4 py-3 mb-3 cursor-pointer"
                onClick={open2CRV}
              >
                <ArrowUpDownIcon className="" />
                <Typography variant="h6" className="mx-3">
                  Get 2CRV
                </Typography>
                <OpenInNewIcon role="button" className="w-5 h-5 ml-auto" />
              </Box>
              <Tooltip title="Not available yet">
                <Box className="bg-mineshaft rounded-md flex items-center pr-2 pl-3.5 py-3 cursor-pointer">
                  <CalculatorIcon className="w-3 h-3" />
                  <Typography variant="h6" className="mx-2 pl-1">
                    Payout Calculator
                  </Typography>
                </Box>
              </Tooltip>
              <Box className="flex items-center mt-5 mb-5">
                <LockOutlinedIcon className="w-5 h-5 text-gray-400" />
                <Box>
                  <Typography variant="h6" className="text-gray-400 mx-2">
                    Withdrawals are locked until end of Epoch{' '}
                    {Number(selectedEpoch!) + 1}
                    <Typography
                      variant="h6"
                      className="text-white inline-flex items-baseline ml-2"
                    >
                      {readableExpiry}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
              <CustomButton
                size="medium"
                className="w-full !rounded-md"
                color={
                  !approved ||
                  (amount > 0 &&
                    amount <= getUserReadableAmount(userTokenBalance, 6))
                    ? 'primary'
                    : 'mineshaft'
                }
                disabled={amount <= 0}
                onClick={approved ? handleDeposit : handleApprove}
              >
                {approved
                  ? amount == 0
                    ? 'Insert an amount'
                    : amount > getUserReadableAmount(userTokenBalance, 6)
                    ? 'Insufficient balance'
                    : 'Deposit'
                  : 'Approve'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex flex-row justify-between">
              <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
                <Box className="flex flex-row h-10 w-[130px] p-1">
                  <img src={'/images/tokens/eth.svg'} alt={'ETH STRADDLE'} />
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-md font-medium pl-1 pt-1.5 ml-1.5"
                  >
                    <span className="text-white">Straddle</span>
                  </Typography>
                </Box>
              </Box>
              <Input
                disableUnderline
                id="notionalSize"
                name="notionalSize"
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                value={rawAmount}
                onChange={(e) => setRawAmount(e.target.value)}
                classes={{ input: 'text-right' }}
              />
            </Box>
          </Box>
          <Box className="mt-4 flex justify-center mb-4">
            <Box className="py-2 w-full rounded border border-neutral-800">
              <Typography variant="h6" className="mx-2 text-white">
                {"You'll spend "}
                {formatAmount(getUserReadableAmount(totalCost, 26), 2)} USDC
              </Typography>
              <Typography variant="h6" className="mx-2 text-neutral-400">
                Current price is $
                {formatAmount(
                  getUserReadableAmount(straddlesEpochData?.currentPrice!, 8),
                  2
                )}
              </Typography>
            </Box>
          </Box>

          <Box className="rounded-lg bg-neutral-800">
            <Box className="p-3">
              <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
                <EstimatedGasCostButton gas={5000000} chainId={chainId} />
              </Box>
              <Box
                className="bg-mineshaft rounded-md flex items-center pr-2 pl-4 py-3 mb-3 cursor-pointer"
                onClick={open2CRV}
              >
                <ArrowUpDownIcon className="" />
                <Typography variant="h6" className="mx-3">
                  Get 2CRV
                </Typography>
                <OpenInNewIcon role="button" className="w-5 h-5 ml-auto" />
              </Box>
              <Tooltip title="Not available yet">
                <Box className="bg-mineshaft rounded-md flex items-center pr-2 pl-3.5 py-3 cursor-pointer">
                  <CalculatorIcon className="w-3 h-3" />
                  <Typography variant="h6" className="mx-2 pl-1">
                    Payout Calculator
                  </Typography>
                </Box>
              </Tooltip>

              <CustomButton
                size="medium"
                className="w-full !rounded-md mt-3"
                color={
                  !approved ||
                  (amount > 0 &&
                    amount <= getUserReadableAmount(userTokenBalance, 6))
                    ? 'primary'
                    : 'mineshaft'
                }
                disabled={
                  !straddlesData?.isVaultReady ||
                  !(
                    straddlesData?.isVaultReady! &&
                    straddlesData?.isEpochExpired!
                  )
                }
                onClick={approved ? handlePurchase : handleApprove}
              >
                {approved
                  ? amount == 0
                    ? 'Insert an amount'
                    : getUserReadableAmount(totalCost, 26) >
                      getUserReadableAmount(userTokenBalance, 6)
                    ? 'Insufficient balance'
                    : straddlesData?.isVaultReady! &&
                      straddlesData?.isEpochExpired!
                    ? 'Purchase'
                    : 'Vault not ready'
                  : 'Approve'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Manage;
