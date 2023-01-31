import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
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
import { max, min } from 'lodash';
import BorrowDialog from './BorrowDialog';
import { useBoundStore } from 'store';
import { LendingStats, SsovLendingData } from 'store/Vault/lending';

const LENDING_URL = 'http://localhost:5001/api/v2/lending';

const AssetRow = ({
  positionIdx,
  assetDatum,
}: {
  positionIdx: number;
  assetDatum: SsovLendingData;
}) => {
  const {
    underlyingSymbol,
    address,
    totalSupply,
    totalBorrow,
    tokenPrice,
    aprs,
  } = assetDatum;
  const [open, setOpen] = React.useState(false);
  const [borrowAmount, setBorrowAmount] = React.useState<string>('1');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleBorrowAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) =>
      setBorrowAmount(e.target.value),
    []
  );

  console.log('aprs: ', aprs);
  const minApr = min(aprs);
  const maxApr = max(aprs);

  return (
    <>
      <StyleRow open={open} key={`main-${underlyingSymbol}`}>
        <TableCell align="left">
          <Box className="flex flex-row">
            <img
              className="-ml-1 w-9 h-9"
              src={`/images/tokens/${underlyingSymbol}.svg`}
              alt={`${underlyingSymbol}`}
            />
            <Typography variant="h6" color="white" className="ml-3 mt-2">
              {underlyingSymbol}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            ${formatAmount(totalSupply, 0, true)}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="caption" color="white">
            ${formatAmount(tokenPrice)}
          </Typography>
        </TableCell>
        {/* <TableCell align="left">
          <Typography variant="caption" color="white">
            83%
          </Typography>
        </TableCell> */}
        <TableCell align="left">
          <Typography variant="caption" color="white">
            {minApr === 0 && minApr === maxApr
              ? '-'
              : `${minApr}% - ${maxApr}%`}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <CustomButton
            className="cursor-pointer text-white"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Borrow
          </CustomButton>
          {anchorEl && (
            <BorrowDialog
              key={positionIdx}
              assetDatum={assetDatum}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <CustomButton onClick={() => setOpen(!open)}>Repay</CustomButton>
        </TableCell>
      </StyleRow>
    </>
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

const Assets = ({ data }: { data: any[] }) => {
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
              {/* <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Utilization
                </Typography>
              </TableCell> */}
              <TableCell align="left" className="border-none">
                <Typography variant="caption" color="stieglitz">
                  Borrow APR
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
          {data.map((assetDatum, idx) => (
            <TableBody key={idx} className="rounded-lg bg-umbra">
              <AssetRow key={idx} positionIdx={idx} assetDatum={assetDatum} />
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

const getBorrowingData = () => {
  return [...Array(30)].map((_, i) => ({
    loanAmount: (ranNum() + 1) * 100,
    timestamp: 123 + i,
  }));
};

const Lending = () => {
  const { chainId } = useBoundStore();
  const [lendingStats, setLendingStats] = useState<LendingStats[]>([]);
  const [assetData, setAssetData] = useState<SsovLendingData[]>([]);

  useEffect(() => {
    (async () => {
      const ssovLendingData = await axios.get(LENDING_URL);
      const ssovs: SsovLendingData[] = ssovLendingData.data[chainId] || [];
      setAssetData(ssovs);

      const lendingStats = `
      {
        "data": [
          {
            "totalSupply": 674529,
            "totalBorrow": 0,
            "timestamp": 1675038259
          },
          {
            "totalSupply": 709672,
            "totalBorrow": 0,
            "timestamp": 1675175442
          }
        ]
      }
    `;
      const stats: LendingStats[] = JSON.parse(lendingStats).data;
      setLendingStats(stats);
    })();
  }, [chainId]);

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
            stats={lendingStats.map((s) => {
              return {
                loanAmount: s.totalSupply,
                timestamp: s.timestamp,
              };
            })}
            totalLoan={180}
          />
          <Chart
            key={'Borrowing'}
            loanType={'Borrowing'}
            // stats={lendingStats.map(s => {
            //   return {
            //     loanAmount: s.totalBorrow,
            //     timestamp: s.timestamp
            //   }
            // })}
            stats={getBorrowingData()}
            totalLoan={180}
          />
        </div>
        <Assets data={assetData} />
      </Box>
    </Box>
  );
};

export default Lending;
