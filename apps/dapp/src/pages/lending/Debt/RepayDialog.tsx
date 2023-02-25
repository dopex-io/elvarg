import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import { SsovV3LendingPut__factory } from 'mocks/factories/SsovV3LendingPut__factory';
import { BigNumber } from 'ethers';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import { Typography, Input, CustomButton, Dialog } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';

import { useBoundStore } from 'store';
import { IDebtPosition } from 'store/Vault/lending';

import useSendTx from 'hooks/useSendTx';

import { formatAmount } from 'utils/general';
import {
  getContractReadableAmount,
  getReadableTime,
  getUserReadableAmount,
} from 'utils/contracts';

import { ARBITRUM_CHAIN_ID, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
  debt: IDebtPosition;
}

export default function RepayDialog({ anchorEl, setAnchorEl, debt }: Props) {
  const { signer, provider, assetToContractAddress, getSsovLending } =
    useBoundStore();
  const sendTx = useSendTx();

  const [repayAmount, setRepayAmount] = useState<string | number>(0);

  const handleMax = useCallback(() => {
    setRepayAmount(getUserReadableAmount(debt.borrowed, DECIMALS_TOKEN));
  }, [debt]);

  const handleRepayAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setRepayAmount(e.target.value),
    []
  );

  const handleRepay = useCallback(
    async (debt: IDebtPosition, repayAmount: string) => {
      if (!signer || !provider) return;
      try {
        const contract = SsovV3LendingPut__factory.connect(
          assetToContractAddress.get(debt.underlyingSymbol)!,
          provider
        );
        await sendTx(contract.connect(signer), 'repay', [
          debt.id,
          getContractReadableAmount(repayAmount, DECIMALS_TOKEN),
        ]).then(() => getSsovLending());
      } catch (err) {
        console.log(err);
        throw new Error('fail to repay');
      }
    },
    [sendTx, provider, signer, assetToContractAddress, getSsovLending]
  );

  const repayGtBorrowed = BigNumber.from(
    getContractReadableAmount(repayAmount, DECIMALS_TOKEN)
  ).gt(BigNumber.from(debt.borrowed));

  console.log('debt.supplied: ', debt.supplied);

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
          <Typography variant="h4" className="mb-2">
            Repay
          </Typography>
          <Box className="space-y-1">
            <Box className="p-2 border border-neutral-800 bg-umbra rounded-xl">
              <Input
                size="small"
                variant="default"
                type="number"
                placeholder="0.0"
                value={repayAmount}
                onChange={handleRepayAmount}
                className="p-0 -ml-1"
                leftElement={
                  <Box className="flex my-auto">
                    <Box className="flex w-[6.2rem] mr-2 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                      <img
                        src={`/images/tokens/2crv.svg`}
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
              <Box className="flex justify-between">
                <Typography variant="h5" color="stieglitz">
                  Repay
                </Typography>
                <Box
                  className="ml-auto mr-2 mt-1.5 cursor-pointer"
                  onClick={handleMax!}
                >
                  <img src="/assets/max.svg" alt="MAX" />
                </Box>
                <Typography variant="h5" className="flex justify-end">
                  {`${formatAmount(
                    getUserReadableAmount(
                      BigNumber.from(debt.borrowed),
                      DECIMALS_TOKEN
                    ),
                    2
                  )}`}
                  <span className="text-stieglitz ml-1">2CRV</span>
                </Typography>
              </Box>
            </Box>
            <Box className="rounded-lg bg-umbra pl-1 pr-2 mt-1 space-y-1">
              <Box className="flex flex-col p-3 space-y-2">
                <ContentRow title="Epoch" content={`${debt.epoch}`} />
                <ContentRow
                  title="Expiry"
                  content={`${getReadableTime(debt.expiry)}`}
                />
                <ContentRow
                  title="Supplied"
                  content={`${formatAmount(
                    getUserReadableAmount(
                      BigNumber.from(debt.supplied),
                      DECIMALS_TOKEN
                    ),
                    2
                  )} ${debt.underlyingSymbol}`}
                />
              </Box>
            </Box>
            <Box className="bg-umbra border border-umbra rounded-lg p-3 mt-2">
              <Box className="bg-carbon rounded-lg p-3">
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
                repayAmount > 0 && !repayGtBorrowed ? 'primary' : 'mineshaft'
              }
              disabled={repayAmount <= 0 || repayGtBorrowed}
              onClick={() => handleRepay(debt, repayAmount.toString())}
            >
              {repayAmount == 0
                ? 'Insert an amount'
                : repayGtBorrowed
                ? 'Repaying more than borrowed'
                : 'Repay'}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
