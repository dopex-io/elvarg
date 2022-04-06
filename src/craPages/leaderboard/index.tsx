import { FC, useContext, useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import BigNumber from 'bignumber.js';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';

import { useGetLeaderboardDataQuery } from 'graphql/generated/optionPools';

import { AssetsContext } from 'contexts/Assets';

import isZeroAddress from 'utils/contracts/isZeroAddress';
import getValueColorClass from 'utils/general/getValueColorClass';

const TableHeaderCell: FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <TableCell className={cx('text-white', className)}>{children}</TableCell>
  );
};

const addressBlacklist = ['0x9de5b00012a27b3efd50d5b90bf2e07413ced178'].map(
  (a) => a.toLowerCase()
);

const Leaderboard = () => {
  const result = useGetLeaderboardDataQuery();

  const { baseAssetsWithPrices } = useContext(AssetsContext);

  let count = 1;

  const data = useMemo(() => {
    if (result.data) {
      const fData = result.data.users.map((u) => {
        const finalPnl = u.userTradeStats.reduce((acc, s) => {
          if (
            s.optionPool.id ===
            '0x149c18c3870b986D482a3bb3d02974A599e978B4'.toLowerCase()
          ) {
            const premium = new BigNumber(s.totalPremium).dividedBy(1e6);

            const callPnl = new BigNumber(s.totalCallPnl)
              .dividedBy(1e18)
              .times(baseAssetsWithPrices.WETH.priceUsd);

            const putPnl = new BigNumber(s.totalPutPnl).dividedBy(1e6);

            const finalPnl = callPnl.plus(putPnl).minus(premium);

            return acc + finalPnl.toNumber();
          } else if (
            s.optionPool.id ===
            '0x2fE742A0Dcdf4a8E9f3F84528EfEb7AF0f2beD80'.toLowerCase()
          ) {
            const premium = new BigNumber(s.totalPremium).dividedBy(1e6);

            const callPnl = new BigNumber(s.totalCallPnl)
              .dividedBy(1e18)
              .times(baseAssetsWithPrices.WBTC.priceUsd);

            const putPnl = new BigNumber(s.totalPutPnl).dividedBy(1e6);

            const finalPnl = callPnl.plus(putPnl).minus(premium);

            return acc + finalPnl.toNumber();
          }
          return acc;
        }, 0);

        return { user: u.id, finalPnl };
      });

      return fData.sort((a, b) => {
        return b.finalPnl - a.finalPnl;
      });
    }
    return [];
  }, [result.data, baseAssetsWithPrices]);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="leaderboard" />
      <Box className="py-32 xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Typography variant="h1" className="mb-3">
          Leaderboard
        </Typography>
        <TableContainer>
          <Table aria-label="leaderboard">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Rank</TableHeaderCell>
                <TableHeaderCell>Address</TableHeaderCell>
                <TableHeaderCell>PnL</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => {
                if (isZeroAddress(item.user)) return null;
                if (item.finalPnl === 0) return null;
                if (addressBlacklist.includes(item.user.toLowerCase()))
                  return null;
                count++;
                return (
                  <TableRow>
                    <TableHeaderCell>{count - 1}</TableHeaderCell>
                    <TableHeaderCell>{item.user}</TableHeaderCell>
                    <TableHeaderCell
                      className={getValueColorClass(item.finalPnl)}
                    >
                      {item.finalPnl}
                    </TableHeaderCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Leaderboard;
