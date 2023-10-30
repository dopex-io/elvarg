import { MouseEventHandler } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Switch } from '@dopex-io/ui';

import { LpPosition } from 'store/Vault/olp';

import ApproveDepositButton from 'components/common/ApproveDepositButton';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
import {
  DialogRow,
  LiquidityDialogRow,
  NumberLiquidityDialogRow,
} from 'components/common/LpCommon/Table';
import Button from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface Props {
  lpPositionSelected: LpPosition;
  usdToReceive: number;
  underlyingToReceive: number;
  rawFillAmount: string;
  setRawFillAmount: Function;
  userTokenBalance: BigNumber;
  approved: boolean;
  isPut: boolean;
  chainId: number;
  outUsd: boolean;
  handleApprove: MouseEventHandler<HTMLButtonElement>;
  handleFillPosition: MouseEventHandler<HTMLButtonElement>;
  handleOutUsd: MouseEventHandler<HTMLButtonElement>;
  fillButtonMessage: string;
  underlyingSymbol: string;
}

export default function FillPositionDialog(props: Props) {
  const {
    lpPositionSelected,
    usdToReceive,
    underlyingToReceive,
    rawFillAmount,
    setRawFillAmount,
    userTokenBalance,
    approved,
    isPut,
    chainId,
    outUsd,
    handleApprove,
    handleFillPosition,
    handleOutUsd,
    fillButtonMessage,
    underlyingSymbol,
  } = props;

  let name: string = underlyingSymbol;
  name += `-${getUserReadableAmount(
    lpPositionSelected?.strike,
    DECIMALS_STRIKE
  )}`;
  name += isPut ? '-P' : '-C';

  function addDecimals(input: BigNumber, decimals: number) {
    const strInput = input.toString();
    const beforeDecimals = strInput.substring(0, strInput.length - decimals);
    const afterDecimals = strInput.substring(
      strInput.length - decimals,
      strInput.length
    );
    return (beforeDecimals ? beforeDecimals : '0') + ('.' + afterDecimals);
  }

  function getOptionTokenAmountBalance(
    lpPositionSelected: LpPosition,
    userTokenBalance: BigNumber,
    rawFillAmount: string,
    setRawFillAmount: Function,
    underlyingSymbol: string
  ) {
    return (
      <Box>
        <Box className="border border-umbra p-2 bg-umbra border-radius rounded-lg">
          <Box className="flex flex-row">
            <Box className="flex flex-row w-56 space-x-1">
              <Box className="flex flex-row h-10 p-1 w-auto mt-1">
                <img
                  src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
                  alt={`${underlyingSymbol.toUpperCase()}`}
                />
                <Typography
                  variant="h6"
                  color="text-white"
                  className="ml-2 mt-1"
                >
                  <span className="text-white">{name}</span>
                </Typography>
              </Box>
              <Button
                color="mineshaft"
                onClick={() => {
                  setRawFillAmount(
                    addDecimals(userTokenBalance, DECIMALS_TOKEN)
                  );
                }}
                className="rounded-md my-auto text-stieglitz h-2/3"
                sx={{ minWidth: 'min-content' }}
              >
                MAX
              </Button>
            </Box>
            <Input
              disableUnderline
              id="notionalSize"
              name="notionalSize"
              placeholder="0"
              type="number"
              className="h-12 text-2xl text-white font-mono w-36"
              value={rawFillAmount}
              onChange={(e) => setRawFillAmount(e.target.value)}
              classes={{ input: 'text-right' }}
            />
          </Box>
          <Box className="flex flex-row justify-between">
            <Box className="flex">
              <Typography variant="h6" className="text-sm pl-1">
                <span className="text-stieglitz">Balance</span>
              </Typography>
            </Box>
            <Box className="ml-auto mr-0">
              <Typography
                variant="h6"
                color="text-stieglitz"
                className="text-sm pl-1"
              >
                <span className="text-white">{`${formatAmount(
                  getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN),
                  2
                )}`}</span>
                <span className="text-stieglitz"> tokens</span>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="border-radius rounded-lg border border-umbra mt-3 p-3 mb-2 space-y-1">
          <DialogRow
            data="Discounted IV"
            value={`${lpPositionSelected.impliedVol}`}
          />

          <DialogRow
            data={'Premium per token'}
            value={`$${formatAmount(
              getUserReadableAmount(lpPositionSelected.premium, DECIMALS_USD),
              2
            )}`}
          />
          <LiquidityDialogRow
            data={'Liquidity available'}
            underlying={underlyingSymbol}
            lpPositionSelected={lpPositionSelected}
          />
        </Box>
      </Box>
    );
  }

  function receiveAmount(handleOutUsd: any) {
    return lpPositionSelected.underlyingLiquidity.gt(BigNumber.from(0)) ? (
      <Box className="flex flex-row justify-between mr-2">
        <Box className="flex flex-row">
          <Typography variant="h6" className="mt-2">
            <span className="text-stieglitz">
              {`Receive ${outUsd ? 'USDC.e' : underlyingSymbol}`}
            </span>
          </Typography>
          <Tooltip
            placement="top"
            className="h-4 text-stieglitz"
            title={`If toggled to USDC.e, the contract will swap the underlying liquidity to USDC.e before transferring to you`}
            arrow={true}
          >
            <InfoOutlinedIcon className="mt-2" />
          </Tooltip>
        </Box>
        <Switch checked={outUsd} onChange={handleOutUsd} />
      </Box>
    ) : null;
  }

  return (
    <Box className="bg-cod-gray rounded-lg mt-4">
      {getOptionTokenAmountBalance(
        lpPositionSelected,
        userTokenBalance,
        rawFillAmount,
        setRawFillAmount,
        underlyingSymbol
      )}

      <Box className="bg-umbra rounded-xl p-3">
        <Box className="bg-carbon rounded-lg p-3 w-full space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          {receiveAmount(handleOutUsd)}
          <NumberLiquidityDialogRow
            data={'I will receive'}
            underlying={underlyingSymbol}
            usdValue={usdToReceive}
            underlyingValue={underlyingToReceive}
            isUsd={
              outUsd || lpPositionSelected?.usdLiquidity.gt(BigNumber.from(0))
            }
          />
        </Box>
        <Box className="flex space-x-2">
          <InfoOutlinedIcon className="fill-current text-stieglitz my-auto" />
          <Typography
            variant="h6"
            className="flex justify-around my-2"
            color="stieglitz"
          >
            This will sell your {name} option token.
          </Typography>
        </Box>
        <ApproveDepositButton
          approved={approved}
          fillButtonMessage={fillButtonMessage}
          handleFillPosition={handleFillPosition}
          handleApprove={handleApprove}
          showPrimary={!approved || fillButtonMessage === 'Fill'}
        />
      </Box>
    </Box>
  );
}
