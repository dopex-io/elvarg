import { useState, useCallback, useEffect } from 'react';
import { BigNumber, utils } from 'ethers';
import Box from '@mui/material/Box';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import {
  DECIMALS_TOKEN,
  ARBITRUM_CHAIN_ID,
  DECIMALS_STRIKE,
  MAX_VALUE,
} from 'constants/index';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { ERC20__factory } from '@dopex-io/sdk';
import { CustomButton, Dialog } from 'components/UI';
import Input from 'components/UI/Input';
import { ISsovLendingData } from 'store/Vault/lending';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { SelectChangeEvent } from '@mui/material';
import {
  allowanceApproval,
  getContractReadableAmount,
  getReadableTime,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import SouthEastRounded from '@mui/icons-material/SouthEastRounded';

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
  const { accountAddress, signer, provider, getSsovLending } = useBoundStore();

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
  const [borrowAmount, setBorrowAmount] = useState<string | number>(0);
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
          getContractReadableAmount(borrowAmount, DECIMALS_TOKEN), // TODO: use underlying decimals
          setUnderlyingApproved,
          setUnderlyingBalance
        );
        allowanceApproval(
          optionTokenAddress,
          accountAddress,
          assetDatum.address,
          signer,
          getContractReadableAmount(borrowAmount, DECIMALS_STRIKE),
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
    borrowAmount,
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
        getContractReadableAmount(borrowAmount, DECIMALS_TOKEN),
      ]);
      setBorrowAmount('0');
      await getSsovLending();
    } catch (e) {
      console.log('fail to borrow');
      throw new Error('fail to borrow');
    }
  }, [
    sendTx,
    borrowAmount,
    strikeIndex,
    assetDatum,
    signer,
    provider,
    getSsovLending,
  ]);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setBorrowAmount(e.target.value),
    []
  );

  const handleMax = useCallback(() => {
    setBorrowAmount(utils.formatEther(underlyingBalance));
  }, [underlyingBalance]);

  // const requiredCollateral =
  //   (amount * strike * collateralPrecision) / getCollateralPrice() / 1e18;
  const usdToReceive =
    (Number(borrowAmount) * assetDatum?.strikes[strikeIndex]!) /
    assetDatum.tokenPrice;

  const optionTokenSymbol = `${
    assetDatum.underlyingSymbol
  }-${assetDatum.strikes[strikeIndex]?.toString()}-P`;

  const borrowAmountValid =
    borrowAmount > 0 &&
    underlyingBalance.gt(
      getContractReadableAmount(borrowAmount, DECIMALS_TOKEN)
    ) &&
    optionBalance.gt(getContractReadableAmount(borrowAmount, DECIMALS_TOKEN));
  console.log('borrowAmountValid: ', borrowAmountValid);

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
      <Box className="bg-cod-gray rounded-xl">
        <Box className="flex flex-col mb-2">
          <Typography variant="h4" className="mb-2">
            Borrow
          </Typography>
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
            <Box className="bg-umbra rounded-xl">
              <Input
                size="small"
                variant="default"
                type="number"
                placeholder="0.0"
                value={borrowAmount}
                onChange={handleDepositAmount}
                className="p-3"
                leftElement={
                  <Box className="flex my-auto">
                    <Box className="flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                      <img
                        src={`/images/tokens/${assetDatum?.underlyingSymbol.toLowerCase()}.svg`}
                        alt="usdc"
                        className="h-8"
                      />
                      <Typography
                        variant="h5"
                        color="white"
                        className="flex items-center ml-2"
                      >
                        {assetDatum?.underlyingSymbol}
                      </Typography>
                    </Box>
                    <Box
                      role="button"
                      className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                      onClick={handleMax}
                    >
                      <Typography variant="caption" color="stieglitz">
                        MAX
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <Box className="flex justify-between pb-3 px-5 pt-0">
                <Typography variant="h6" color="stieglitz">
                  Collateral
                </Typography>
                <Typography variant="h6" color="stieglitz">
                  Balance:{' '}
                  {`${formatAmount(
                    getUserReadableAmount(underlyingBalance, DECIMALS_TOKEN),
                    2
                  )}`}
                </Typography>
              </Box>
            </Box>
            <Box className="bg-umbra rounded-xl">
              <Input
                size="small"
                variant="default"
                type="number"
                placeholder="0.0"
                value={usdToReceive}
                disabled
                sx={{
                  '& input.MuiInputBase-input': {
                    '-webkit-text-fill-color': 'white',
                    overflowX: 'true',
                    padding: '0',
                  },
                }}
                leftElement={
                  <Box className="flex my-auto">
                    <Box className="flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                      <img
                        src="/images/tokens/2crv.svg"
                        alt="usdc"
                        className="h-8 p-1"
                      />
                      <Typography
                        variant="h5"
                        color="white"
                        className="flex items-center ml-2"
                      >
                        2CRV
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <Box className="flex justify-between pb-3 px-5 pt-0">
                <Typography variant="h6" color="stieglitz">
                  Borrow
                </Typography>
                <Typography variant="h6" color="stieglitz">
                  Liquidity:
                  <span className="text-white">
                    {` $${formatAmount(assetDatum.totalSupply, 2, true)}`}
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* <Box className="rounded-xl bg-umbra p-2">
            <Box className="flex">
              <Box className="p-1 rounded-full flex w-full">
                <Box className="bg-cod-gray flex p-1 px-2 rounded-full mr-1">
                  <img
                    src="/images/tokens/usdc.svg"
                    alt="usdc"
                    className="h-8"
                  />
                  <Typography
                    variant="h5"
                    color="white"
                    className="flex items-center ml-2"
                  >
                    USDC
                  </Typography>
                </Box>
                <CustomButton
                  onClick={handleMax}
                  className="rounded-md p-1"
                  color="mineshaft"
                >
                  <Typography variant="h6" color="stieglitz">
                    MAX
                  </Typography>
                </CustomButton>
              </Box>

              <Input
                disableUnderline
                id="amount"
                name="amount"
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-stieglitz font-mono"
                value={borrowAmount}
                onChange={handleDepositAmount}
                classes={{ input: 'text-right' }}
              />
            </Box>

            <Box className="flex justify-between p-1">
              <Typography variant="h6" color="stieglitz">
                Borrow
              </Typography>
            </Box>
          </Box>

          {/* TODO: space-x */}
          {/* <Box className="rounded-xl bg-umbra p-2 mt-1">
            <Box className="flex">
              <Box className="p-1 rounded-full flex w-full">
                <Box className="bg-cod-gray flex p-1 px-2 rounded-full mr-1">
                  <img
                    src={`/images/tokens/${assetDatum?.underlyingSymbol.toLowerCase()}.svg`}
                    alt="usdc"
                    className="h-8"
                  />
                  <Typography
                    variant="h5"
                    color="white"
                    className="flex items-center ml-2"
                  >
                    {assetDatum?.underlyingSymbol}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" className="flex items-center">
                ${formatAmount(usdToReceive, 2)}
              </Typography>
            </Box>
            <Box className="flex justify-between p-1">
              <Typography variant="h6" color="stieglitz">
                Collateral
              </Typography>
              <Typography variant="h6" color="stieglitz">
                {assetDatum?.underlyingSymbol}
              </Typography>
            </Box>
          </Box> */}

          {/* <Typography variant="h6">
            {`Balance of ${optionTokenSymbol}: ${formatAmount(
              getUserReadableAmount(userOptionTokenBalance, DECIMALS_TOKEN),
              2
            )}`}
          </Typography>

          <Typography variant="h6">
            {`Deposit ${borrowAmount} ${
              assetDatum.underlyingSymbol
            } and ${borrowAmount} ${optionTokenSymbol} to borrow ${formatAmount(
              usdToReceive,
              2
            )} 2CRV`}
          </Typography> */}

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
              <EstimatedGasCostButton
                gas={500000}
                chainId={ARBITRUM_CHAIN_ID}
              />
            </Box>
          </Box>
          <CustomButton
            size="medium"
            className="w-full mt-4 !rounded-md"
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
              ? borrowAmount == 0
                ? 'Insert an amount'
                : !borrowAmountValid
                ? 'Invalid borrow amount'
                : 'Borrow'
              : 'Approve'}
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
}
