import { useState, useCallback } from 'react';
import { utils } from 'ethers';
import Box from '@mui/material/Box';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import {
  DECIMALS_TOKEN,
  DECIMALS_STRIKE,
  DECIMALS_USD,
  MAX_VALUE,
  TOKEN_DECIMALS,
} from 'constants/index';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { Addresses } from '@dopex-io/sdk';
import { CustomButton, Dialog } from 'components/UI';
import Input from 'components/UI/Input';
import useUserTokenBalance from 'hooks/useUserTokenBalance';
import { SsovLendingData } from 'store/Vault/lending';
import InputHelpers from 'components/common/InputHelpers';
import { SsovV4Put__factory } from 'mocks/factories/SsovV4Put__factory';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { SelectChangeEvent } from '@mui/material';
import useAssetApproval from 'hooks/useAssetApproval';
import { getContractReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import SouthEastRounded from '@mui/icons-material/SouthEastRounded';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  assetDatum: SsovLendingData;
}

export default function BorrowDialog({
  anchorEl,
  setAnchorEl,
  assetDatum,
}: Props) {
  const { accountAddress, signer, provider } = useBoundStore();

  const sendTx = useSendTx();
  const [strikeIndex, setStrikeIndex] = useState(0);

  const tokenAddress =
    Addresses[assetDatum.chainId][assetDatum.underlyingSymbol];
  const optionTokenAddress = assetDatum.optionTokens[strikeIndex]!;

  const userTokenBalance = useUserTokenBalance(
    accountAddress!,
    tokenAddress,
    signer
  );
  const userOptionTokenBalance = useUserTokenBalance(
    accountAddress!,
    optionTokenAddress,
    signer
  );

  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrikeIndex(Number(event.target.value));
  }, []);

  const [tokenDepositAmount, setTokenDepositAmount] = useState<string | number>(
    0
  );

  const [handleTokenApprove, tokenApproved] = useAssetApproval(
    signer,
    assetDatum.address,
    tokenAddress
  );
  const [handleOptionTokenApprove, optionTokenApproved] = useAssetApproval(
    signer,
    assetDatum.address,
    optionTokenAddress
  );

  const handleBorrow = useCallback(async () => {
    if (!signer || !provider) return;

    const contract = SsovV4Put__factory.connect(assetDatum.address, provider);

    try {
      await sendTx(contract.connect(signer), 'borrow', [
        strikeIndex,
        getContractReadableAmount(tokenDepositAmount, DECIMALS_TOKEN),
      ]);

      setTokenDepositAmount('0');

      // await updateOlpEpochData!();
      // await updateOlpUserData!();
    } catch (e) {
      console.log('fail to borrow');
      throw new Error('fail to borrow');
    }
  }, [sendTx, tokenDepositAmount, strikeIndex, assetDatum, signer, provider]);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setTokenDepositAmount(e.target.value),
    []
  );

  const handleMax = useCallback(() => {
    setTokenDepositAmount(utils.formatEther(userTokenBalance));
  }, [userTokenBalance]);

  // requiredCollateral = ((amount * strike * collateralPrecision) / getCollateralPrice()) / 1e18;
  const usdToReceive =
    (Number(tokenDepositAmount) * assetDatum?.strikes[strikeIndex]!) /
    assetDatum.tokenPrice;

  const optionTokenSymbol = `${
    assetDatum.underlyingSymbol
  }-${assetDatum.strikes[strikeIndex]?.toString()}-P`;

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
      <Box className="bg-cod-gray rounded-lg">
        <Box className="flex flex-col mb-2">
          <Typography variant="h5">Borrow</Typography>
          <Box className="rounded-lg p-3 pt-2.5 pb-2 border border-neutral-800 w-full bg-umbra my-2">
            <SsovStrikeBox
              userTokenBalance={userOptionTokenBalance}
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
                value={tokenDepositAmount}
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
                    getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN),
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
                        className="h-8"
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
                  {/* {formatAmount(userTokenBalances?.[inverted ? 0 : 1] ?? 0, 3)} */}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* <Box className="rounded-lg bg-umbra p-2">
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
                value={tokenDepositAmount}
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
          {/* <Box className="rounded-lg bg-umbra p-2 mt-1">
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
            {`Deposit ${tokenDepositAmount} ${
              assetDatum.underlyingSymbol
            } and ${tokenDepositAmount} ${optionTokenSymbol} to borrow ${formatAmount(
              usdToReceive,
              2
            )} 2CRV`}
          </Typography> */}

          <Box className="rounded-lg bg-umbra pl-1 pr-2 mt-1 space-y-1">
            <Box className="flex flex-col p-3 space-y-2">
              <Box className="flex space-x-1">
                <SouthEastRounded className="fill-current text-down-bad p-1" />
                <Typography variant="h6" color="stieglitz">
                  Put Option
                </Typography>
              </Box>
              <ContentRow title="Premium" content="123" />
              <ContentRow title="Options Fee" content="123" />
              <ContentRow title="Borrow Fees" content="123" />
              <ContentRow title="Options" content="123" />
            </Box>
          </Box>

          <Box className="bg-umbra border border-umbra rounded-lg p-3 mt-2">
            <Box className="bg-carbon rounded-lg p-3">
              <EstimatedGasCostButton gas={500000} chainId={42161} />
            </Box>
          </Box>

          <CustomButton
            size="medium"
            className="w-full mt-4 !rounded-md"
            color={
              !tokenApproved ||
              (tokenDepositAmount > 0 &&
                tokenDepositAmount <=
                  getUserReadableAmount(userTokenBalance, 18))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={tokenDepositAmount <= 0}
            // approve token, e.g., $DPX, then approve $DPX-4444-P, then deposit
            onClick={
              !tokenApproved
                ? handleTokenApprove
                : !optionTokenApproved
                ? handleOptionTokenApprove
                : handleBorrow
            }
          >
            {tokenApproved
              ? tokenDepositAmount == 0
                ? 'Insert an amount'
                : tokenDepositAmount >
                  getUserReadableAmount(userTokenBalance, 18)
                ? 'Insufficient balance'
                : 'Deposit'
              : 'Approve'}
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
}
