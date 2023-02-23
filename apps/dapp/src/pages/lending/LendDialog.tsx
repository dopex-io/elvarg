import { useState, useCallback, useEffect, SyntheticEvent } from 'react';
import { BigNumber, utils } from 'ethers';
import { Box, SelectChangeEvent, Slider } from '@mui/material';
import { Addresses, ERC20__factory } from '@dopex-io/sdk';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';
import { Typography, Input } from 'components/UI';

import { useBoundStore } from 'store';
import { ISsovLendingData } from 'store/Vault/lending';

import SsovStrikeBox from 'components/common/SsovStrikeBox';
import InputHelpers from 'components/common/InputHelpers';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import { CustomButton, Dialog } from 'components/UI';
import LockerIcon from 'svgs/icons/LockerIcon';

import useSendTx from 'hooks/useSendTx';

import {
  allowanceApproval,
  getUserReadableAmount,
  getContractReadableAmount,
  getReadableTime,
} from 'utils/contracts';

import { DECIMALS_TOKEN, ARBITRUM_CHAIN_ID, MAX_VALUE } from 'constants/index';
import { formatAmount } from 'utils/general';
import styled from '@emotion/styled';
import { max, min } from 'lodash';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: '#2D2D2D',
  '& .MuiSlider-thumb': {
    backgroundColor: 'white',
  },
  '& .MuiSlider-rail': {
    color: '#2D2D2D',
  },
}));

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  assetDatum: ISsovLendingData;
}

function valuetext(value: number) {
  return `$${value}`;
}

export default function LendDialog({
  anchorEl,
  setAnchorEl,
  assetDatum,
}: Props) {
  const { accountAddress, signer, provider, getSsovLending } = useBoundStore();

  const sendTx = useSendTx();
  const [strikeIndex, setStrikeIndex] = useState(0);
  const [collatBalance, setCollatBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [approved, setApproved] = useState<boolean>(false);

  // 2CRV address
  const tokenAddress = '0xb01ff8efc9905de664c5ea62ab938bb141ce0ee8';
  // const tokenAddress =
  //   Addresses[assetDatum.chainId][assetDatum.collateralTokenAddress];

  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrikeIndex(Number(event.target.value));
  }, []);

  const [sliderValue, setSliderValue] = useState(assetDatum.strikes[0]);

  const handleSliderChange = useCallback(
    (
      _: Event | SyntheticEvent<Element, Event>,
      newValue: number | number[]
    ) => {
      if (typeof newValue === 'number') {
        setSliderValue(newValue);
      }
    },
    []
  );

  const [tokenDepositAmount, setTokenDepositAmount] = useState<string | number>(
    0
  );

  const handleApprove = useCallback(async () => {
    if (!signer || !assetDatum?.address) return;
    try {
      await sendTx(ERC20__factory.connect(tokenAddress, signer), 'approve', [
        assetDatum.address,
        MAX_VALUE,
      ]);
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, assetDatum, tokenAddress]);

  useEffect(() => {
    (async () => {
      if (!signer || !accountAddress) return;
      try {
        allowanceApproval(
          tokenAddress,
          accountAddress,
          assetDatum.address,
          signer,
          getContractReadableAmount(tokenDepositAmount, DECIMALS_TOKEN),
          setApproved,
          setCollatBalance
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [signer, accountAddress, assetDatum, tokenDepositAmount]);

  const handleLend = useCallback(async () => {
    if (!signer || !provider) return;

    const contract = SsovV3LendingPut__factory.connect(
      assetDatum.address,
      provider
    );

    try {
      await sendTx(contract.connect(signer), 'deposit', [
        strikeIndex,
        getContractReadableAmount(tokenDepositAmount, DECIMALS_TOKEN),
        accountAddress,
      ]).then(() => {
        setTokenDepositAmount('0');
      });
      await getSsovLending();
    } catch (e) {
      console.log('fail to lend');
      throw new Error('fail to lend');
    }
  }, [
    sendTx,
    tokenDepositAmount,
    strikeIndex,
    assetDatum,
    signer,
    provider,
    accountAddress,
    getSsovLending,
  ]);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setTokenDepositAmount(e.target.value),
    []
  );

  const handleMax = useCallback(() => {
    setTokenDepositAmount(utils.formatEther(collatBalance));
  }, [collatBalance]);

  const minApr = min(assetDatum.aprs);
  const maxApr = max(assetDatum.aprs);

  return (
    <Dialog
      open={anchorEl != null}
      handleClose={() => setAnchorEl(null)}
      disableScrollLock={true}
      sx={{
        '.MuiPaper-root': {
          padding: '12px',
        },
      }}
      width={368}
    >
      <Box className="bg-cod-gray p-1 rounded-xl w-full space-y-2">
        <Typography variant="h5">Lend</Typography>
        <Box className="p-2 border border-neutral-800 bg-umbra rounded-xl">
          <Input
            size="small"
            variant="default"
            type="number"
            placeholder="0.0"
            value={tokenDepositAmount}
            onChange={handleDepositAmount}
            className="p-0 -ml-1"
            leftElement={
              <Box className="flex my-auto">
                <Box className="flex w-[6.2rem] mr-2 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                  <img
                    src={`/images/tokens/${assetDatum.underlyingSymbol.toLowerCase()}.svg`}
                    alt="usdc"
                    className="h-8"
                  />
                  <Typography
                    variant="h5"
                    color="white"
                    className="flex items-center ml-2"
                  >
                    {assetDatum.underlyingSymbol}
                  </Typography>
                </Box>
              </Box>
            }
          />
          <Box className="flex justify-between">
            <Typography variant="h5" color="stieglitz">
              Deposit
            </Typography>
            <Box
              className="ml-auto mr-2 mt-1.5 cursor-pointer"
              onClick={handleMax!}
            >
              <img src="/assets/max.svg" alt="MAX" />
            </Box>
            <Typography variant="h5" className="flex justify-end">
              {`${formatAmount(
                getUserReadableAmount(collatBalance, DECIMALS_TOKEN),
                2
              )}`}
              <span className="text-stieglitz ml-1">
                {assetDatum.underlyingSymbol}
              </span>
            </Typography>
          </Box>
        </Box>
        <Box className="p-2 border border-neutral-800 bg-umbra rounded-xl">
          <div className="flex justify-between">
            <Typography variant="h5" color="stieglitz">
              Strike Price
            </Typography>
            <Typography variant="h5">${sliderValue}</Typography>
          </div>
          <Box className="px-3 mt-2 pb-0">
            <CustomSlider
              aria-label="custom prices"
              defaultValue={assetDatum.strikes[0]!}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              marks={assetDatum.strikes.map((strike) => ({
                value: strike,
              }))}
              step={null}
              max={assetDatum.strikes[0]!}
              min={assetDatum.strikes[assetDatum.strikes.length - 1]!}
              onChange={handleSliderChange}
            />
          </Box>
        </Box>
        <Box>
          <Box className="rounded-xl flex flex-col p-3 border border-neutral-800 space-y-1">
            <ContentRow
              title="Withdrawable"
              content={getReadableTime(assetDatum.expiry)}
            />
            <ContentRow
              title="Current APR"
              content={
                minApr === 0 && minApr === maxApr
                  ? '-'
                  : `${minApr}% - ${maxApr}%`
              }
            />
          </Box>
        </Box>
        <Box className="rounded-xl p-2 border border-neutral-800 w-full bg-umbra mt-4">
          <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
            <EstimatedGasCostButton gas={500000} chainId={ARBITRUM_CHAIN_ID} />
          </Box>
          <CustomButton
            size="medium"
            className="w-full mt-4 !rounded-md"
            color={
              !approved ||
              (tokenDepositAmount > 0 &&
                tokenDepositAmount <=
                  getUserReadableAmount(collatBalance, DECIMALS_TOKEN))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={tokenDepositAmount <= 0}
            onClick={!approved ? handleApprove : handleLend}
          >
            {approved
              ? tokenDepositAmount == 0
                ? 'Insert an amount'
                : tokenDepositAmount >
                  getUserReadableAmount(collatBalance, DECIMALS_TOKEN)
                ? 'Insufficient balance'
                : 'Deposit'
              : 'Approve'}
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
}
