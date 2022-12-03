import { MouseEventHandler } from 'react';
import { Box, Input, Switch, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BigNumber } from 'ethers';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import {
  DialogRow,
  LiquidityDialogRow,
  NumberLiquidityDialogRow,
} from 'components/common/LpCommon/Table';
import { Typography } from 'components/UI';

import { LpPosition } from 'store/Vault/olp';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN, DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import Button from 'components/UI/Button';

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

interface SwitchProps {
  theme?: any;
  underlyingImg: string;
}

const MaterialUISwitch = styled(Switch)(
  ({ theme, underlyingImg }: SwitchProps) => ({
    width: 62,
    height: 34,
    padding: 5,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url(${'/images/tokens/usdc.svg'})`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${underlyingImg})`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  })
);

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
            <Box className="flex flex-row w-56">
              <Box className="flex flex-row h-10 p-1 w-48 mt-1">
                <img
                  src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
                  alt={`${underlyingSymbol.toUpperCase()}`}
                />
                <Typography
                  variant="h6"
                  color="text-white"
                  className="text-left w-full relative ml-2 mt-1"
                >
                  <span className="text-white">{name}</span>
                </Typography>
              </Box>
              <Box className="border-radius rounded-lg mt-2 h-6 mr-6">
                <Button
                  color="mineshaft"
                  onClick={() => {
                    setRawFillAmount(
                      addDecimals(userTokenBalance, DECIMALS_TOKEN)
                    );
                  }}
                  className="mb-2"
                >
                  <Typography variant="h6" color="stieglitz" className="">
                    MAX
                  </Typography>
                </Button>
              </Box>
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
              {`Receive ${outUsd ? 'USDC' : underlyingSymbol}`}
            </span>
          </Typography>

          <Tooltip
            placement="top"
            className="h-4 text-stieglitz"
            title={`If toggled to USDC, the contract will swap the underlying liquidity to USDC before transferring to you`}
            arrow={true}
          >
            <InfoOutlinedIcon className="mt-2" />
          </Tooltip>
        </Box>
        <MaterialUISwitch
          underlyingImg={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
          checked={outUsd}
          onChange={handleOutUsd}
          className="-mr-2"
        />
      </Box>
    ) : null;
  }

  return (
    <Box className="bg-cod-gray rounded-lg w-84">
      <Box className="flex justify-between items-center mb-2 p-1">
        <Typography variant="h6" className="text-lg">
          Fill LP
        </Typography>
      </Box>
      {getOptionTokenAmountBalance(
        lpPositionSelected,
        userTokenBalance,
        rawFillAmount,
        setRawFillAmount,
        underlyingSymbol
      )}

      <Box className="border border-umbra rounded-xl pb-2 px-2">
        <Box className="rounded-xl p-3 border border-umbra w-full bg-umbra mt-4 mb-3">
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

        <Typography
          variant="h6"
          className="text-sm flex justify-around mb-1"
          color="stieglitz"
        >
          This will sell your {name} option token
        </Typography>

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
