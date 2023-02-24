import { useState, useCallback, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { Box, SelectChangeEvent } from '@mui/material';
import SouthEastRounded from '@mui/icons-material/SouthEastRounded';
import { ERC20__factory } from '@dopex-io/sdk';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';

import { useBoundStore } from 'store';
import { ISsovLendingData } from 'store/Vault/lending';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { Typography, Dialog } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';

import useSendTx from 'hooks/useSendTx';

import {
  allowanceApproval,
  getContractReadableAmount,
  getReadableTime,
} from 'utils/contracts';
import { DECIMALS_TOKEN, MAX_VALUE } from 'constants/index';

import { BorrowButton } from './BorrowButton';
import { BorrowForm } from './BorrowForm';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  assetDatum: ISsovLendingData;
}

export default function BorrowDialog({
  anchorEl,
  setAnchorEl,
  assetDatum,
}: Props) {
  const { accountAddress, signer, provider, getSsovLending, chainId } =
    useBoundStore();

  const sendTx = useSendTx();
  const [strikeIndex, setStrikeIndex] = useState(0);

  // const tokenAddress =
  //   Addresses[assetDatum.chainId][assetDatum.underlyingSymbol];
  // eth token
  const tokenAddress = '0x36EbEeC09CefF4a060fFfa27D3a227F51Ce20919';
  const optionTokenAddress = assetDatum.optionTokens[strikeIndex]!;

  const [underlyingApproved, setUnderlyingApproved] = useState<boolean>(false);
  const [underlyingBalance, setUnderlyingBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [borrowAmountUsd, setBorrowAmountUsd] = useState<string | number>(0);
  const collatToDeposit =
    (Number(borrowAmountUsd) * 1.0) / assetDatum?.strikes[strikeIndex]!;
  const [optionApproved, setOptionApproved] = useState<boolean>(false);
  const [optionBalance, setOptionBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrikeIndex(Number(event.target.value));
  }, []);

  const handleUnderlyingApproved = useCallback(async () => {
    if (!signer || !assetDatum?.address) return;
    try {
      await sendTx(ERC20__factory.connect(tokenAddress, signer), 'approve', [
        assetDatum.address,
        MAX_VALUE,
      ]);
      setUnderlyingApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, assetDatum, tokenAddress]);

  const handleOptionApproved = useCallback(async () => {
    if (!signer || !assetDatum?.address) return;
    try {
      await sendTx(
        ERC20__factory.connect(optionTokenAddress, signer),
        'approve',
        [assetDatum.address, MAX_VALUE]
      );
      setOptionApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, assetDatum, optionTokenAddress]);

  useEffect(() => {
    (async () => {
      if (!signer || !accountAddress) return;
      try {
        allowanceApproval(
          tokenAddress,
          accountAddress,
          assetDatum.address,
          signer,
          getContractReadableAmount(collatToDeposit, DECIMALS_TOKEN),
          setUnderlyingApproved,
          setUnderlyingBalance
        );
        allowanceApproval(
          optionTokenAddress,
          accountAddress,
          assetDatum.address,
          signer,
          getContractReadableAmount(collatToDeposit, DECIMALS_TOKEN),
          setOptionApproved,
          setOptionBalance
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [
    signer,
    accountAddress,
    tokenAddress,
    optionTokenAddress,
    assetDatum.address,
    collatToDeposit,
    underlyingApproved,
    optionApproved,
  ]);

  const handleBorrow = useCallback(async () => {
    if (!signer || !provider) return;
    const contract = SsovV3LendingPut__factory.connect(
      assetDatum.address,
      provider
    );
    try {
      await sendTx(contract.connect(signer), 'borrow', [
        strikeIndex,
        getContractReadableAmount(collatToDeposit, DECIMALS_TOKEN),
      ]);
      setBorrowAmountUsd('0');
      await getSsovLending();
    } catch (e) {
      console.log('fail to borrow');
      throw new Error('fail to borrow');
    }
  }, [
    sendTx,
    collatToDeposit,
    strikeIndex,
    assetDatum,
    signer,
    provider,
    getSsovLending,
  ]);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setBorrowAmountUsd(e.target.value),
    []
  );

  const optionTokenSymbol = `${
    assetDatum.underlyingSymbol
  }-${assetDatum.strikes[strikeIndex]?.toString()}-P`;

  const borrowAmountValid =
    borrowAmountUsd > 0 &&
    underlyingBalance.gt(
      getContractReadableAmount(collatToDeposit, DECIMALS_TOKEN)
    ) &&
    optionBalance.gt(
      getContractReadableAmount(collatToDeposit, DECIMALS_TOKEN)
    );

  return (
    <Dialog
      open={anchorEl != null}
      handleClose={() => setAnchorEl(null)}
      disableScrollLock={true}
      sx={{
        '.MuiPaper-root': {
          padding: '18px',
          borderRadius: '24px',
        },
      }}
      width={368}
    >
      <Box className="bg-cod-gray rounded-xl">
        <Box className="flex flex-col mb-2">
          <Box className="flex justify-between items-center">
            <Typography variant="h5">Borrow</Typography>
            <a
              href={`/ssov/${assetDatum.symbol}`}
              rel="noopener noreferrer"
              target={'_blank'}
            >
              <Typography
                variant="h6"
                className="-mb-1 hover:text-white hover:underline"
                color="stieglitz"
              >
                Purchase option
              </Typography>
            </a>
          </Box>
          <Box className="rounded-xl p-3 pt-2.5 pb-2 border border-neutral-800 w-full bg-umbra my-2">
            <SsovStrikeBox
              userTokenBalance={optionBalance}
              collateralSymbol={optionTokenSymbol}
              strike={strikeIndex}
              handleSelectStrike={handleSelectStrike}
              strikes={assetDatum?.strikes.map((s) => s.toString())}
            />
          </Box>
          <Box className="space-y-1">
            <BorrowForm
              underlyingSymbol={assetDatum?.underlyingSymbol}
              onChange={handleDepositAmount}
              underlyingBalance={underlyingBalance}
              totalSupply={assetDatum?.totalSupply}
              collatToDeposit={collatToDeposit}
              borrowAmountUsd={borrowAmountUsd}
            />
          </Box>
          <Box className="rounded-xl bg-umbra pl-1 pr-2 mt-1 space-y-1">
            <Box className="flex flex-col p-3 space-y-2">
              <Box className="flex space-x-1">
                <SouthEastRounded className="fill-current text-down-bad p-1" />
                <Typography variant="h6" color="stieglitz">
                  Put Option
                </Typography>
              </Box>
              <ContentRow
                title="Expiry"
                content={`${getReadableTime(assetDatum.expiry)}`}
              />
              <ContentRow
                title="Borrow APR"
                content={`${assetDatum.aprs[strikeIndex] ?? 0}%`}
              />
            </Box>
          </Box>
          <Box className="bg-umbra border border-umbra rounded-xl p-3 mt-2">
            <Box className="bg-carbon rounded-xl p-3">
              <EstimatedGasCostButton gas={500000} chainId={chainId} />
            </Box>
          </Box>
          <BorrowButton
            color={
              !underlyingApproved || !optionApproved || borrowAmountValid
                ? 'primary'
                : 'mineshaft'
            }
            disabled={!borrowAmountValid}
            onClick={
              !underlyingApproved
                ? handleUnderlyingApproved
                : !optionApproved
                ? handleOptionApproved
                : handleBorrow
            }
          >
            {underlyingApproved && optionApproved
              ? borrowAmountUsd == 0
                ? 'Insert an amount'
                : !borrowAmountValid
                ? 'Invalid borrow amount'
                : 'Borrow'
              : 'Approve'}
          </BorrowButton>
        </Box>
      </Box>
    </Dialog>
  );
}
