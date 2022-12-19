import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import AppBar from 'components/common/AppBar';
import {
  Button,
  Collapse,
  Grid,
  Input,
  LinearProgress,
  Slider,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip as MuiTooltip,
} from '@mui/material';
import { BigNumber } from 'ethers';
import InputHelpers from 'components/common/InputHelpers';
import { CollateralChart } from './CollateralChart';
import { BorrowingChart } from './BorrowingChart';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { TOKEN_DATA } from 'constants/tokens';

const TopBar = () => {
  return (
    <Box>
      <Box className="flex flex-row">
        <Box className="flex flex-row rounded-3xl bg-umbra py-1 px-3 w-fit h-fit mt-1">
          <img className="w-9 h-9" src="/images/tokens/usdc.svg" alt="USDC" />
          <img className="w-9 h-9" src="/images/tokens/ETH.svg" alt="ETH" />
        </Box>
        <Box className="ml-3">
          <Typography variant="h4" className="mr-">
            USDC <span className="text-stieglitz">| Ethereum</span>
          </Typography>
          <Typography variant="h6" color="stieglitz">
            0x12345
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Stats = ({ currentUtilization }: { currentUtilization: number }) => {
  const [value, setValue] = React.useState<number>(currentUtilization);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  const borrowApr = value / 100;
  const earnApr = value / 100;

  const GridWrapper = styled(Grid)`
    @media (max-width: 800px) {
      flex-direction: column;
    }
  `;

  return (
    <Box className="flex flex-row grow mt-5 bg-umbra p-3 rounded-2xl justify-around">
      <Box className="">
        <GridWrapper container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Total earning
            </Typography>
            <Typography variant="h5" color="white">
              $170.25M
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Earn APR
            </Typography>
            <Box className="flex flex-row mt-1">
              <img
                className="w-5 h-5"
                src="/images/tokens/usdc.svg"
                alt="USDC"
              />
              <Typography variant="h5" color="white" className="ml-1.5 -mt-1">
                1.47%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Earn Distribution
            </Typography>
            <Typography variant="h5" color="white">
              0.00%
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Reserves
            </Typography>
            <Typography variant="h5" color="white">
              $580.71K
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Total borrowing
            </Typography>
            <Typography variant="h5" color="white">
              $170.25M
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Borrow APR
            </Typography>
            <Box className="flex flex-row mt-1">
              <img
                className="w-5 h-5"
                src="/images/tokens/usdc.svg"
                alt="USDC"
              />
              <Typography variant="h5" color="white" className="ml-1.5 -mt-1">
                1.47%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Borrow Distribution
            </Typography>
            <Typography variant="h5" color="white">
              2.87%
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="stieglitz">
              Oracle Price
            </Typography>
            <Typography variant="h5" color="white">
              $1.00
            </Typography>
          </Grid>
        </GridWrapper>
      </Box>
      <Box className="w-2/5 mr-2 -mt-3">
        <Grid container spacing={3}>
          <Grid item xs={3} className="relative top-3.5">
            <Typography variant="h6" color="white">
              Utilization
            </Typography>
          </Grid>
          <Grid item xs={3} className="relative top-3.5">
            <Typography variant="h6" color="white">
              {value}%
            </Typography>
          </Grid>
          <Grid item xs={6} className="relative top-3">
            <Slider
              defaultValue={value}
              aria-label="Default"
              valueLabelDisplay="auto"
              onChange={handleChange}
              sx={{
                color: 'white',
                '.MuiSlider-thumb': {
                  height: 12,
                  width: 12,
                },
              }}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography variant="h6" color="white">
              Borrow
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="white">
              {borrowApr}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box className="mt-2">
              <LinearProgress variant="determinate" value={value} />
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Typography variant="h6" color="white">
              Earn APR
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="white">
              {earnApr}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box className="mt-2">
              <LinearProgress variant="determinate" value={value} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export interface AssetData {
  symbol: string;
  assetDecimals: BigNumber;
  assetPrice: BigNumber;
  epochTimes: BigNumber[];
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  sumTotalEpochStrikeDeposits: BigNumber;
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  availableCollateralForStrikes: BigNumber[];
  sumAvailableCollateralForStrikes: BigNumber;
  totalCollateralFromLiquidations: BigNumber;
  totalBorrowedCollateral: BigNumber;
  totalSuppliedUnderlying: BigNumber;
}

const AssetRow = ({ data }: { data: AssetData }) => {
  const [open, setOpen] = React.useState(false);
  const [borrowAmount, setBorrowAmount] = React.useState<string>('1');

  const handleBorrowAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) =>
      setBorrowAmount(e.target.value),
    []
  );

  return (
    <>
      <StyleRow open={open} key={`main-${data.symbol}`}>
        <TableCell align="left">
          <Box className="flex flex-row">
            <img
              className="-ml-1 w-9 h-9"
              src={`/images/tokens/${data.symbol}.svg`}
              alt={`${data.symbol}`}
            />
            <div className="ml-2">
              <Typography variant="caption" color="white">
                {TOKEN_DATA[data.symbol]!.name}
              </Typography>
              <Typography variant="caption" color="white">
                {data.symbol}
              </Typography>
            </div>
          </Box>
        </TableCell>
        <TableCell align="left">
          <MuiTooltip
            title={
              <Box className="p-1 w-48 ">
                <Box className="flex flex-row justify-between mb-3">
                  <Typography variant="caption" color="inherit">
                    {data.symbol} Supply Cap
                  </Typography>
                  <Typography variant="caption" color="stieglitz">
                    $
                    {formatAmount(
                      getUserReadableAmount(data.sumTotalEpochStrikeDeposits, 6)
                    )}
                  </Typography>
                </Box>
                <Typography variant="caption" color="inherit">
                  There is $
                  {formatAmount(
                    getUserReadableAmount(
                      data.sumAvailableCollateralForStrikes,
                      6
                    )
                  )}
                  of ETH capacity remaining.
                </Typography>
              </Box>
            }
            disableInteractive
            className="h-4"
            placement="top"
          >
            <Button
              style={{
                minHeight: '2.5rem',
                padding: '10px',
              }}
            >
              <Box className="w-24">
                <Typography
                  variant="caption"
                  color="white"
                  className="relative right-5 bottom-2"
                >
                  $
                  {formatAmount(
                    getUserReadableAmount(
                      data.sumAvailableCollateralForStrikes,
                      6
                    )
                  )}
                </Typography>
                <LinearProgress variant="determinate" value={50} />
              </Box>
            </Button>
          </MuiTooltip>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            $
            {formatAmount(
              getUserReadableAmount(
                data.assetPrice,
                data.assetDecimals.toNumber()
              )
            )}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            $0.14
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            83%
          </Typography>
        </TableCell>
        <TableCell align="right">
          <CustomButton onClick={() => setOpen(!open)}>Borrow</CustomButton>
        </TableCell>
      </StyleRow>
      <TableRow key={`dropdown-${data.symbol}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <AssetRowStats
              key={data.symbol}
              asset={data.symbol}
              borrowAmount={borrowAmount}
              handleBorrowAmount={handleBorrowAmount}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ltvBox = ({ percent, amount }: { percent: number; amount: number }) => {
  return (
    <Box
      className="space-y-1.5 p-1 bg-mineshaft rounded-lg pb-2 w-min"
      sx={{
        minWidth: '5rem',
      }}
    >
      <Typography
        variant="caption"
        color="stieglitz"
        className="flex justify-center "
      >
        {percent}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          maxWidth: '60%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      <Typography
        variant="caption"
        color="white"
        className="flex justify-center"
      >
        ${amount}
      </Typography>
    </Box>
  );
};

const AssetRowStats = ({
  asset,
  handleBorrowAmount,
  borrowAmount,
}: {
  asset: string;
  handleBorrowAmount: Function;
  borrowAmount: string;
}) => {
  const ltvs = [
    { percent: 25, amount: 25 },
    { percent: 50, amount: 50 },
    { percent: 75, amount: 75 },
    { percent: 100, amount: 100 },
  ];

  // const handleMax = React.useCallback(() => {
  //   setBorrowAmount(utils.formatEther(userTokenBalance));
  // }, [userTokenBalance]);

  const DropdownWrapper = styled(Box)`
    border: 0.125rem solid #3e3e3e;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;

    @media (max-width: 800px) {
      flex-direction: column;
      min-width: 100px;
      align-items: center;
    }
  `;

  const LtvWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
    border-right: solid #3e3e3e 2px;
    width: fit-content;

    @media (max-width: 800px) {
      flex-direction: column;
      border-right: revert;
      align-items: center;
    }
  `;

  const StatsWrapper = styled(Box)`
    padding: 1rem;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 800px) {
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      border-top: solid #3e3e3e 2px;
      border-bottom: solid #3e3e3e 2px;
    }
  `;

  const BalanceWrapper = styled(Box)`
    gap: 0.125rem;
    border-left: solid #3e3e3e 2px;
    width: fit-content;
    display: flex;
    padding: 0.5rem;
    flex-direction: column;

    @media (max-width: 800px) {
      border-left: revert;
    }
  `;

  return (
    <DropdownWrapper key={asset}>
      <LtvWrapper>
        <Typography variant="caption" color="white" className="self-center">
          Loan To Value Ratio (LTV)
        </Typography>
        <Box className="flex flex-row gap-1">
          {ltvs.map((ltv) => ltvBox(ltv))}
        </Box>
      </LtvWrapper>
      <StatsWrapper>
        <Box className="flex justify-between  w-full">
          <Typography variant="caption" color="white" className="w-fit">
            Average Liquidity
          </Typography>
          <Typography variant="caption" color="stieglitz" className="ml-3">
            $116M
          </Typography>
        </Box>
        <Box className="flex justify-between w-full">
          <Typography variant="caption" color="white">
            Borrow APR
          </Typography>
          <Typography variant="caption" color="stieglitz">
            12%
          </Typography>
        </Box>
      </StatsWrapper>

      <BalanceWrapper>
        <Typography variant="caption" className="self-end " color="stieglitz">
          Balance: 1 {asset}
        </Typography>
        <Box className="flex flex-row border border-mineshaft rounded-lg p-1 bg-mineshaft">
          <Input
            key={`borrow-${asset}`}
            disableUnderline
            type="number"
            className="rounded-md pl-2"
            classes={{ input: 'text-white text-xs text-left' }}
            value={borrowAmount}
            onChange={handleBorrowAmount}
          />
          <CustomButton className="w-fit h-1">Borrow</CustomButton>
        </Box>
        <Typography variant="caption" className="self-start" color="stieglitz">
          Max Borrowable: $250
        </Typography>
      </BalanceWrapper>
    </DropdownWrapper>
  );
};

const StyleContainer = styled(TableContainer)`
  table {
    border-spacing: 0;
    border-radius: 0.5rem;
    border: none !important;
  }
  td {
    border: none !important;
  }
  tr:last-child td:first-of-type {
    border-bottom-left-radius: 10px;
  }
  tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }
`;

const StyleRow = styled(TableRow)`
  td:first-of-type {
    border-top-left-radius: 10px;
    border-bottom-left-radius: ${(props: { open: boolean }) =>
      !props.open ? '10px' : '0'};
  }
  td:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: ${(props: { open: boolean }) =>
      !props.open ? '10px' : '0'};
  }
`;

const Assets = () => {
  const assetData: AssetData[] = [
    {
      asset: 'ETH',
      totalLiquidity: 116,
      oraclePrice: 1.5,
      collateralRatio: 0.5,
      borrowAPR: 12,
      ltv: [0.5, 0.6, 0.7, 0.8, 0.9],
    },
    {
      asset: 'USDC',
      totalLiquidity: 116,
      oraclePrice: 1.5,
      collateralRatio: 0.5,
      borrowAPR: 12,
      ltv: [0.5, 0.6, 0.7, 0.8, 0.9],
    },
  ];

  return (
    <Box className="bg-cod-gray p-2 mt-2 border-radius rounded-lg ">
      <StyleContainer>
        <Table>
          <TableHead className="bg-cod-gray">
            <TableRow>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Collateral Asset
                </Typography>
              </TableCell>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Total Liquidity
                </Typography>
              </TableCell>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Oracle Price
                </Typography>
              </TableCell>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Reserves
                </Typography>
              </TableCell>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Utilization
                </Typography>
              </TableCell>
              <TableCell align="right" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {assetData.map((assetDatum) => (
            <TableBody key={assetDatum.symbol} className="rounded-lg bg-umbra">
              <AssetRow key={assetDatum.symbol} data={assetDatum} />
            </TableBody>
          ))}
        </Table>
      </StyleContainer>
    </Box>
  );
};

interface DebtPosition {
  id: BigNumber;
  epoch: BigNumber;
  strike: BigNumber;
  supplied: BigNumber;
  borrowed: BigNumber;
}

const DebtRow = ({ debt }: { debt: DebtPosition }) => {
  return (
    <TableBody key={debt.id.toNumber()} className="rounded-lg bg-umbra">
      <TableRow key={`debt-row-${debt.id}`}>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            {debt.epoch.toString()}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption" color="white">
            ${formatAmount(getUserReadableAmount(debt.strike, 8), 2)}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption" color="white">
            ${formatAmount(getUserReadableAmount(debt.supplied, 18), 2)}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="caption" color="white">
            ${formatAmount(getUserReadableAmount(debt.borrowed, 6), 2)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <CustomButton>Repay</CustomButton>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

const Debts = ({ data }: { data: DebtPosition[] }) => {
  return (
    <Box className="bg-cod-gray p-2 mt-2 border-radius rounded-lg ">
      <StyleContainer>
        <Table>
          <TableHead className="bg-cod-gray">
            <TableRow>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Epoch
                </Typography>
              </TableCell>
              <TableCell align="center" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Strike
                </Typography>
              </TableCell>
              <TableCell align="center" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Supplied
                </Typography>
              </TableCell>
              <TableCell align="center" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Borrowed
                </Typography>
              </TableCell>
              <TableCell align="right" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {data.map((debt) => (
            <DebtRow key={debt.id.toNumber()} debt={debt} />
          ))}
        </Table>
      </StyleContainer>
    </Box>
  );
};

const ranNum = () => {
  return Math.floor(Math.random() * 10);
};

const getCollateralData = () => {
  return [...Array(10)].map((_, i) => ({
    earn_apr: ranNum() * 10,
    collateral: ranNum() * 100,
    datetime: `${ranNum() + 1} Dec`,
  }));
};

const getBorrowingData = () => {
  return [...Array(10)].map((_, i) => ({
    borrow_apr: ranNum() * 10,
    borrowing: ranNum() * 100,
    datetime: `${ranNum() + 1} Dec`,
  }));
};

const getDebtData = () => {
  return [...Array(6)].map((_, i) => ({
    id: BigNumber.from(i),
    epoch: BigNumber.from(1),
    strike: BigNumber.from(ranNum()).mul(oneEBigNumber(8)),
    supplied: BigNumber.from(ranNum()).mul(oneEBigNumber(18)),
    borrowed: BigNumber.from(ranNum()).mul(oneEBigNumber(6)),
  }));
};

const Lending = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Lending | Dopex</title>
      </Head>
      <AppBar active="Lending" />
      <Box className="lg:pt-28 lg:max-w-5xl md:max-w-3xl sm:max-w-2xl ml-auto mr-auto">
        <TopBar />
        <div className="flex flex-row justify-between">
          <CollateralChart data={getCollateralData()} totalCollateral={180} />
          <BorrowingChart data={getBorrowingData()} totalBorrowing={180} />
        </div>
        <Stats currentUtilization={45} />
        <Assets />
        <Debts data={getDebtData()} />
      </Box>
    </Box>
  );
};

export default Lending;
