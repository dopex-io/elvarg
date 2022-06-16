import { useContext, useMemo } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { CircularProgress } from '@mui/material';

import Typography from 'components/UI/Typography';

import {
  AtlanticsContext,
  IAtlanticPoolCheckpoint,
  IAtlanticPoolType,
} from 'contexts/Atlantics';
import { WalletContext } from 'contexts/Wallet';

import getTokenDecimals from 'utils/general/getTokenDecimals';

const TableHeader = ({
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'stieglitz',
  width = 100,
}) => {
  return (
    // @ts-ignore TODO: FIX
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="bg-cod-gray border-1 border-b-0 border-umbra py-2"
      sx={{ width }}
    >
      <Typography variant="h6" className={`text-${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TableBodyCell = ({
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'stieglitz',
  fill = 'bg-cod-gray',
  width = 100,
}) => {
  return (
    // @ts-ignore TODO: FIX
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className={`${fill} border-0 py-3`}
      sx={{ width }}
    >
      <Typography variant="h6" className={`text-${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

// Remove repeating components
const PoolCompositionTable = () => {
  const { selectedPool } = useContext(AtlanticsContext);
  const { chainId } = useContext(WalletContext);

  const pool = useMemo(() => {
    if (!selectedPool) return;
    return selectedPool as IAtlanticPoolType;
  }, [selectedPool]);

  const tokenComposition = useMemo((): { [key: string]: number } => {
    if (!pool) return { '': 0 };
    const maxStrikes = pool.strikes as BigNumber[];
    const data = pool.data as IAtlanticPoolCheckpoint[];
    let totalDepositToken = 0;
    let totalUnderlying = 0;

    if (pool.isPut) {
      const depositTokenDecimals = getTokenDecimals(
        pool.tokens.deposit,
        chainId
      );
      const underlyingTokenDecimals = getTokenDecimals(
        pool.tokens.underlying,
        chainId
      );
      maxStrikes.forEach((_, index) => {
        totalDepositToken +=
          Number(
            data[index]?.fundingCollected.add(data[index]?.premiumCollected!)
          ) /
          10 ** depositTokenDecimals;
        totalUnderlying +=
          Number(data[index]?.underlyingCollected) /
          10 ** underlyingTokenDecimals;
      });
      return {
        [pool.tokens.deposit]: totalDepositToken,
        [pool.tokens.underlying]: totalUnderlying,
      };
    } else {
      return { '': 0 };
    }
  }, [chainId, pool]);

  return (
    <TableContainer
      className={`rounded-xl border-umbra border border-b-0 w-full overflow-x-auto`}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader align="left" width={525}>
              Token <ArrowDownwardRoundedIcon className="p-1" />
            </TableHeader>
            <TableHeader align="right" width={5}>
              Total revenue
            </TableHeader>
            <TableHeader align="right" width={5}>
              Premia
            </TableHeader>
            <TableHeader align="right" width={5}>
              Funding
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(tokenComposition).map((key, index) => {
            return (
              <TableRow className="py-2" key={index}>
                <TableBodyCell width={525}>
                  <Box className="flex space-x-2">
                    {key !== '' ? (
                      <img
                        src={`/images/tokens/${key}.svg`}
                        alt={key}
                        className="w-[2rem] h-auto my-auto"
                      />
                    ) : (
                      <CircularProgress size="20px" />
                    )}
                    <Box className="text-left my-auto">
                      <Typography variant="h6">{key!}</Typography>
                    </Box>
                  </Box>
                </TableBodyCell>
                <TableBodyCell width={5}>
                  <Box className="flex space-x-2 bg-umbra rounded-lg p-1 justify-between">
                    <Typography variant="h6" className="my-auto">
                      {tokenComposition[key]}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="bg-mineshaft rounded-md p-1"
                      color="stieglitz"
                    >
                      {key}
                    </Typography>
                  </Box>
                </TableBodyCell>
                <TableBodyCell align="right" width={5}>
                  <Box className="flex flex-col items-end">
                    <Typography
                      variant="h6"
                      className="my-auto"
                      color="stieglitz"
                    >
                      {'-'}
                    </Typography>
                  </Box>
                </TableBodyCell>
                <TableBodyCell align="right" width={5}>
                  <Box className="flex flex-col items-end">
                    <Typography variant="h6" color="stieglitz">
                      {'-'}
                    </Typography>
                  </Box>
                </TableBodyCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PoolCompositionTable;
