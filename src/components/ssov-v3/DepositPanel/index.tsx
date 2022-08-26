import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import cx from 'classnames';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useBoundStore } from 'store';
import { SsovV3Context, SsovV3EpochData } from 'contexts/SsovV3';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import LockerIcon from 'svgs/icons/LockerIcon';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { MAX_VALUE } from 'constants/index';

import styles from './styles.module.scss';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const DepositPanel = () => {
  const { accountAddress, chainId, signer, updateAssetBalances } =
    useBoundStore();
  const {
    updateSsovV3EpochData: updateSsovEpochData,
    updateSsovV3UserData: updateSsovUserData,
    ssovData,
    ssovEpochData,
    ssovSigner,
  } = useContext(SsovV3Context);

  const sendTx = useSendTx();

  const [strikeDepositAmount, setStrikeDepositAmount] = useState<
    number | string
  >(0);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const { ssovContractWithSigner } = ssovSigner;

  const { epochTimes, epochStrikes } = ssovEpochData as SsovV3EpochData;

  const [approved, setApproved] = useState<boolean>(false);
  const [strike, setStrike] = useState(0);

  const spender = useMemo(() => {
    return ssovContractWithSigner?.address;
  }, [ssovContractWithSigner]);

  const strikes = epochStrikes.map((strike: string | number | BigNumber) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrike(Number(event.target.value));
  }, []);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setStrikeDepositAmount(e.target.value),
    []
  );

  const handleApprove = useCallback(async () => {
    if (!ssovData?.collateralAddress || !signer || !spender) return;
    try {
      await sendTx(
        ERC20__factory.connect(ssovData.collateralAddress, signer).approve(
          spender,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, ssovData]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    if (!ssovContractWithSigner || !accountAddress) return;
    try {
      await ssovContractWithSigner.deposit(
        strike,
        getContractReadableAmount(strikeDepositAmount, 18),
        accountAddress
      );
      setStrikeDepositAmount(0);
      updateAssetBalances();
      updateSsovEpochData();
      updateSsovUserData();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    ssovContractWithSigner,
    strike,
    strikeDepositAmount,
    updateAssetBalances,
    updateSsovEpochData,
    updateSsovUserData,
  ]);

  // Updates approved state
  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !ssovData?.collateralAddress ||
        !accountAddress ||
        !spender
      )
        return;
      const finalAmount: BigNumber = getContractReadableAmount(
        strikeDepositAmount.toString(),
        18
      );
      const allowance: BigNumber = await ERC20__factory.connect(
        ssovData.collateralAddress,
        signer
      ).allowance(accountAddress, spender);
      setApproved(allowance.gte(finalAmount));
    })();
  }, [accountAddress, signer, spender, strikeDepositAmount, ssovData]);

  // Updates user token balance
  useEffect(() => {
    (async function () {
      if (!accountAddress || !ssovData?.collateralAddress || !signer) return;
      const bal = await ERC20__factory.connect(
        ssovData?.collateralAddress,
        signer
      ).balanceOf(accountAddress);
      setUserTokenBalance(bal);
    })();
  }, [accountAddress, signer, ssovData]);

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4',
        styles['cardWidth']
      )}
    >
      <Box className="flex mb-3">
        <Typography variant="h3" className="text-stieglitz">
          Deposit
        </Typography>
        {ssovData?.isPut ? (
          <a
            href="https://arbitrum.curve.fi/2pool/deposit"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto mt-1"
          >
            <Box role="button" className="underline">
              <Typography variant="h6" className="text-stieglitz">
                Get 2CRV
              </Typography>
            </Box>
          </a>
        ) : null}
      </Box>

      <Box>
        <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
          <Box className="flex">
            <Typography
              variant="h6"
              className="text-stieglitz ml-0 mr-auto text-[0.72rem]"
            >
              Balance
            </Typography>
            <Typography
              variant="h6"
              className="text-white ml-auto mr-0 text-[0.72rem]"
            >
              {formatAmount(getUserReadableAmount(userTokenBalance, 18), 8)}{' '}
              {ssovData?.collateralSymbol}
            </Typography>
          </Box>
          <Box className="mt-2 flex">
            <Box className={'w-full'}>
              <Select
                className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
                fullWidth
                value={strike}
                onChange={handleSelectStrike}
                input={<Input />}
                variant="outlined"
                placeholder="Select Strike Prices"
                MenuProps={SelectMenuProps}
                classes={{
                  icon: 'absolute right-7 text-white',
                  select: 'overflow-hidden',
                }}
                disableUnderline
                label="strikes"
              >
                {strikes.map((strike: string, index: number) => (
                  <MenuItem key={index} value={index} className="pb-2 pt-2">
                    <Typography
                      variant="h5"
                      className="text-white text-left w-full relative ml-3"
                    >
                      ${formatAmount(strike, 4)}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box className="mt-3">
            <Box className="flex mb-3 group">
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Amount
              </Typography>
              <Input
                disableUnderline={true}
                type="number"
                className="w-[11.3rem] lg:w-[9.3rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
                classes={{ input: 'text-white text-xs text-right' }}
                value={strikeDepositAmount}
                placeholder="0"
                onChange={handleDepositAmount}
              />
            </Box>
          </Box>
        </Box>
        <Box className="mt-3.5">
          <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-0 p-3 border border-neutral-800 w-full">
            <Box className={'flex mb-1'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Epoch
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {ssovData?.currentEpoch}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex mb-1'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Withdrawable
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {epochTimes[1]
                    ? format(
                        new Date(epochTimes[1].toNumber() * 1000),
                        'd LLL yyyy'
                      )
                    : '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-4">
          <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
            <EstimatedGasCostButton gas={500000} chainId={chainId} />
          </Box>
          <Box className="flex">
            <Box className="flex text-center p-2 mr-2 mt-1">
              <LockerIcon />
            </Box>
            <Typography variant="h6" className="text-stieglitz">
              Withdrawals are locked until end of Epoch{' '}
              {(ssovData?.currentEpoch || 0) + 1}{' '}
              <span className="text-white">
                ({' '}
                {epochTimes[1]
                  ? format(
                      new Date(epochTimes[1].toNumber() * 1000),
                      'd MMM yyyy HH:mm'
                    )
                  : '-'}
                )
              </span>
            </Typography>
          </Box>
          <CustomButton
            size="medium"
            className="w-full mt-4 !rounded-md"
            color={
              !approved ||
              (strikeDepositAmount > 0 &&
                strikeDepositAmount <=
                  getUserReadableAmount(userTokenBalance, 18))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={strikeDepositAmount <= 0}
            onClick={approved ? handleDeposit : handleApprove}
          >
            {approved
              ? strikeDepositAmount == 0
                ? 'Insert an amount'
                : strikeDepositAmount >
                  getUserReadableAmount(userTokenBalance, 18)
                ? 'Insufficient balance'
                : 'Deposit'
              : 'Approve'}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DepositPanel;
