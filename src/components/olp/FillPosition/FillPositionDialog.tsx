import { MouseEventHandler } from 'react';
import { Box, Input, Switch, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BigNumber } from 'ethers';

import { LpPosition } from 'store/Vault/olp';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import {
  DialogRow,
  LiquidityDialogRow,
  NumberLiquidityDialogRow,
} from 'components/common/LpCommon/Table';
import { Typography } from 'components/UI';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN, DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';

interface Props {
  handleClose: Function;
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
    handleClose,
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

  function fillLpWord(handleClose: Function) {
    return (
      <Box className="flex justify-between items-center mb-6 p-1">
        <Typography variant="h6" className="text-lg">
          Fill LP
        </Typography>
        <CloseIcon
          role="button"
          className="h-6 w-6"
          onClick={() => handleClose()}
        />
      </Box>
    );
  }

  function lpInfo(strike: BigNumber) {
    return (
      <Box>
        <Typography variant="h6" className="ml-3 text-sm">
          Selling my $
          {formatAmount(getUserReadableAmount(strike, DECIMALS_STRIKE), 2)}{' '}
          strike option token
        </Typography>
      </Box>
    );
  }

  function getOptionTokenAmountBalance(
    isPut: boolean,
    lpPositionSelected: LpPosition,
    userTokenBalance: BigNumber,
    rawFillAmount: string,
    setRawFillAmount: Function,
    usdToReceive: number,
    underlyingToReceive: number,
    underlyingSymbol: string,
    outUsd: boolean,
    handleReceive: any
  ) {
    let name: string = underlyingSymbol;
    name += `-${getUserReadableAmount(
      lpPositionSelected?.strike,
      DECIMALS_STRIKE
    )}`;
    name += isPut ? '-P' : '-C';
    return (
      <Box className="items-center p-2 mt-3">
        <Box className="flex flex-row mt-1.5">
          <Box className="flex flex-row h-10 p-1 -ml-1">
            <img
              src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
              alt={`${underlyingSymbol.toUpperCase()}`}
            />
            <Typography
              variant="h5"
              color="text-white"
              className="text-left w-full relative ml-2 mt-1"
            >
              <span className="text-white">{name}</span>
            </Typography>
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono w-36"
            value={rawFillAmount}
            onChange={(e) => setRawFillAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>

        {lpPositionSelected.underlyingLiquidity.gt(BigNumber.from(0)) && (
          <Box className="flex flex-row mt-2 -mb-1 justify-between mr-2">
            <Box className="flex flex-row">
              <Typography variant="h6" className="mt-2 ml-1">
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
              onChange={handleReceive}
              className="-mr-2"
            />
          </Box>
        )}

        <DialogRow
          data={'My balance'}
          value={`${formatAmount(
            getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN),
            2
          )} tokens`}
        />
        <DialogRow
          data={'Discounted IV'}
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
    );
  }

  return (
    <Box className="bg-cod-gray rounded-2xl p-4 pr-3">
      {fillLpWord(handleClose)}
      {lpInfo(lpPositionSelected.strike)}
      {getOptionTokenAmountBalance(
        isPut,
        lpPositionSelected,
        userTokenBalance,
        rawFillAmount,
        setRawFillAmount,
        usdToReceive,
        underlyingToReceive,
        underlyingSymbol,
        outUsd,
        handleOutUsd
      )}
      <Box className="rounded-xl p-3 border border-neutral-800 w-full bg-umbra mt-4 mb-3">
        <EstimatedGasCostButton gas={500000} chainId={chainId} />
      </Box>
      <ApproveDepositButton
        approved={approved}
        fillButtonMessage={fillButtonMessage}
        handleFillPosition={handleFillPosition}
        handleApprove={handleApprove}
        showPrimary={!approved || fillButtonMessage === 'Fill'}
      />
    </Box>
  );
}
