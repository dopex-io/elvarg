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
import { Chart } from './Chart';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

export interface AssetData {
  name: string;
  symbol: string;
  borrowAPR: number[];
  price: number;
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
                {data.name}
              </Typography>
              <Typography variant="caption" color="white">
                {data.symbol}
              </Typography>
            </div>
          </Box>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            $123
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            ${formatAmount(data.price)}
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
        <TableCell align="right">
          <CustomButton onClick={() => setOpen(!open)}>Repay</CustomButton>
        </TableCell>
      </StyleRow>
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
      name: 'Ether',
      symbol: 'ETH',
      borrowAPR: [12],
      price: 1200,
    },
    {
      name: 'Dopex',
      symbol: 'DPX',
      borrowAPR: [12],
      price: 300,
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
                  Total Supply
                </Typography>
              </TableCell>
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Price
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

const ranNum = () => {
  return Math.floor(Math.random() * 10);
};

const getCollateralData = () => {
  return [...Array(30)].map((_, i) => ({
    loanAmount: (ranNum() + 1) * 100,
    datetime: `${ranNum() + 1} Dec`,
  }));
};

const getBorrowingData = () => {
  return [...Array(30)].map((_, i) => ({
    loanAmount: (ranNum() + 1) * 100,
    datetime: `${ranNum() + 1} Dec`,
  }));
};

const Lending = () => {
  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Lending | Dopex</title>
      </Head>
      <AppBar active="Lending" />
      <Box className="lg:pt-28 lg:max-w-5xl md:max-w-3xl sm:max-w-2xl ml-auto mr-auto mt-10">
        <div className="flex flex-row justify-between mb-10">
          <Chart
            key={'Collateral'}
            loanType={'Collateral'}
            data={getCollateralData()}
            totalLoan={180}
          />
          <Chart
            key={'Borrowing'}
            loanType={'Borrowing'}
            data={getBorrowingData()}
            totalLoan={180}
          />
        </div>
        <Assets />
      </Box>
    </Box>
  );
};

export default Lending;
