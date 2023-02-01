import { useState, useCallback } from 'react';
import { utils } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
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
import useUserTokenBalance from 'hooks/useUserTokenBalance';
import { SsovLendingData } from 'store/Vault/lending';
import InputHelpers from 'components/common/InputHelpers';
import { SsovV4Put__factory } from 'mocks/factories/SsovV4Put__factory';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { SelectChangeEvent } from '@mui/material';
import useAssetApproval from 'hooks/useAssetApproval';
import { getContractReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

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
          <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra mt-2">
            <SsovStrikeBox
              userTokenBalance={userTokenBalance}
              collateralSymbol={assetDatum?.underlyingSymbol}
              strike={strikeIndex}
              handleSelectStrike={handleSelectStrike}
              strikes={assetDatum?.strikes.map((s) => s.toString())}
            />
            <Box className="flex mt-2 group">
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                {assetDatum.underlyingSymbol} to deposit
              </Typography>
              <Box className="relative">
                <InputHelpers handleMax={handleMax} />
                <Input
                  disableUnderline={true}
                  type="number"
                  className="w-[11.3rem] lg:w-[9.3rem] border-[#545454] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-[1.5px] rounded-md pl-2 pr-2"
                  classes={{ input: 'text-white text-xs text-right' }}
                  value={tokenDepositAmount}
                  placeholder="0"
                  onChange={handleDepositAmount}
                />
              </Box>
            </Box>
          </Box>

          <Typography variant="h6">
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
          </Typography>

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
