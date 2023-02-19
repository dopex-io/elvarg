import { useState, useCallback, useEffect } from 'react';
import { BigNumber, utils } from 'ethers';
import { Box, Input, SelectChangeEvent } from '@mui/material';
import { Addresses, ERC20__factory } from '@dopex-io/sdk';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';

import { useBoundStore } from 'store';
import { ISsovLendingData } from 'store/Vault/lending';

import SsovStrikeBox from 'components/common/SsovStrikeBox';
import InputHelpers from 'components/common/InputHelpers';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Typography from 'components/UI/Typography';
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
      <Box className="bg-cod-gray p-1 rounded-xl w-full">
        <Box className="flex mb-3">
          <Typography variant="h3" className="text-stieglitz">
            Lend
          </Typography>
        </Box>
        <Box>
          <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full bg-umbra">
            <SsovStrikeBox
              userTokenBalance={collatBalance}
              collateralSymbol={'2CRV'}
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
      </Box>
    </Dialog>
  );
}
