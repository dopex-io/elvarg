import { useState, useCallback } from 'react';
import { utils } from 'ethers';
import Box from '@mui/material/Box';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';
import LockerIcon from 'svgs/icons/LockerIcon';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { DECIMALS_TOKEN, ARBITRUM_CHAIN_ID } from 'constants/index';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { Addresses } from '@dopex-io/sdk';
import { CustomButton, Dialog } from 'components/UI';
import Input from '@mui/material/Input';
import useUserTokenBalance from 'hooks/useUserTokenBalance';
import { ISsovLendingData } from 'store/Vault/lending';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';
import SsovStrikeBox from 'components/common/SsovStrikeBox';
import { SelectChangeEvent } from '@mui/material';
import useAssetApproval from 'hooks/useAssetApproval';
import { getContractReadableAmount, getReadableTime } from 'utils/contracts';
import InputHelpers from 'components/common/InputHelpers';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  assetDatum: ISsovLendingData;
}

export default function LendDialog({
  anchorEl,
  setAnchorEl,
  assetDatum,
}: Props) {
  const { accountAddress, signer, provider } = useBoundStore();

  const sendTx = useSendTx();
  const [strikeIndex, setStrikeIndex] = useState(0);

  const tokenAddress = '0xeA460116299D59C722c88D0EF900a5F78Ab8557E';
  // const tokenAddress =
  //   Addresses[assetDatum.chainId][assetDatum.underlyingSymbol];

  const userTokenBalance = useUserTokenBalance(
    accountAddress!,
    tokenAddress,
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

  const handleLend = useCallback(async () => {
    if (!signer || !provider) return;

    const contract = SsovV3LendingPut__factory.connect(
      assetDatum.address,
      provider
    );

    try {
      await sendTx(contract.connect(signer), 'deposit', [
        assetDatum.strikes[strikeIndex],
        getContractReadableAmount(tokenDepositAmount, DECIMALS_TOKEN),
        accountAddress,
      ]).then(() => {
        setTokenDepositAmount('0');
        // TODO: update
      });
    } catch (e) {
      console.log('fail to borrow');
      throw new Error('fail to borrow');
    }
  }, [
    sendTx,
    tokenDepositAmount,
    strikeIndex,
    assetDatum,
    signer,
    provider,
    accountAddress,
  ]);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setTokenDepositAmount(e.target.value),
    []
  );

  const handleMax = useCallback(() => {
    setTokenDepositAmount(utils.formatEther(userTokenBalance));
  }, [userTokenBalance]);

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
        {/* <Box>
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
          </Box> */}
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
                    {assetDatum.epoch?.toString() ?? '-'}
                  </Typography>
                </Box>
              </Box>
              {/* <Box className={'flex mb-1'}>
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
              </Box> */}
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
              <EstimatedGasCostButton
                gas={500000}
                chainId={ARBITRUM_CHAIN_ID}
              />
            </Box>
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <LockerIcon />
              </Box>
              <Typography variant="h6" className="text-stieglitz">
                {`Withdrawals are locked until end of Epoch ${assetDatum.epoch} `}
                <span className="text-white">
                  ({getReadableTime(assetDatum.expiry)})
                </span>
              </Typography>
            </Box>
            <CustomButton
              size="medium"
              className="w-full mt-4 !rounded-md"
              color={
                !tokenApproved ||
                (tokenDepositAmount > 0 &&
                  tokenDepositAmount <=
                    getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN))
                  ? 'primary'
                  : 'mineshaft'
              }
              disabled={tokenDepositAmount <= 0}
              onClick={!tokenApproved ? handleTokenApprove : handleLend}
            >
              {tokenApproved
                ? tokenDepositAmount == 0
                  ? 'Insert an amount'
                  : tokenDepositAmount >
                    getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN)
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
