import { useState, useCallback } from 'react';
import { utils } from 'ethers';
import Box from '@mui/material/Box';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';
import LockerIcon from 'svgs/icons/LockerIcon';

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
import { SsovV4Put__factory } from 'mocks/factories/SsovV4Put__factory';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { SelectChangeEvent } from '@mui/material';
import useAssetApproval from 'hooks/useAssetApproval';
import { getContractReadableAmount, getReadableTime } from 'utils/contracts';
import { formatAmount } from 'utils/general';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import SouthEastRounded from '@mui/icons-material/SouthEastRounded';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  assetDatum: SsovLendingData;
}

export default function LendDialog({
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
      <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full">
        <Box className="flex mb-3">
          <Typography variant="h3" className="text-stieglitz">
            Deposit
          </Typography>
          hello
        </Box>
        <Box>
          <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
            <SsovStrikeBox
              userTokenBalance={userTokenBalance}
              collateralSymbol={assetDatum.underlyingSymbol}
              strike={strikeIndex}
              handleSelectStrike={handleSelectStrike}
              strikes={assetDatum?.strikes.map((s) => s.toString())}
            />
            <Box className="mt-3">
              <Box className="flex mb-3 group">
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Amount
                </Typography>
                <Box className="relative">
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
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="mt-3.5">
            <Box className="rounded-xl flex flex-col mb-0 p-3 border border-neutral-800 w-full">
              <Box className={'flex mb-1'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Epoch
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    todo
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mb-1'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Withdrawable
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {getReadableTime(assetDatum.expiry)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-4">
            <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
              <EstimatedGasCostButton gas={500000} chainId={42161} />
            </Box>
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <LockerIcon />
              </Box>
              <Typography variant="h6" className="text-stieglitz">
                Withdrawals are locked until end of Epoch{' '}
                {getReadableTime(assetDatum.expiry)}
              </Typography>
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
      </Box>
    </Dialog>
  );
}
