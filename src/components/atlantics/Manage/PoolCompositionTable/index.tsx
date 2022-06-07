import { useContext, useMemo, useEffect } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import Typography from 'components/UI/Typography';

import { AtlanticsContext } from 'contexts/Atlantics';

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

interface PoolCompositionTableProps {
  collateral: string;
  underlying: string;
}

// Remove repeating components
const PoolCompositionTable = (props: PoolCompositionTableProps) => {
  const { collateral, underlying } = props;

  const { atlanticPoolEpochData } = useContext(AtlanticsContext);

  // console.log(atlanticPoolEpochData);

  // {
  //   strikePrice: BigNumber.from(2000),
  //   liquidity: BigNumber.from(10000),
  //   liquidityBalance: BigNumber.from(1000),
  //   premiumCollected: BigNumber.from(60),
  //   fundingCollected: BigNumber.from(2),
  //   unwindFeesCollected: BigNumber.from(2),
  //   underlyingCollected: BigNumber.from(4),
  // }

  const assetsMapping = useMemo(
    () => ({
      Collateral: collateral,
      Underlying: underlying,
    }),
    [collateral, underlying]
  ) as { [key: string]: string };

  const maxStrikesAccumulator = useMemo(() => {
    if (!atlanticPoolEpochData.maxStrikesData) return;

    let fundingAccumulator: BigNumber = BigNumber.from(0);
    let underlyingAccumulator: BigNumber = BigNumber.from(0);
    let premiumAccumulator: BigNumber = BigNumber.from(0);
    atlanticPoolEpochData.maxStrikesData.map(
      (data: { [key: string]: BigNumber }) => {
        data['premiumCollected'] &&
          (premiumAccumulator = premiumAccumulator.add(
            data['premiumCollected']
          ));
        data['fundingCollected'] &&
          (fundingAccumulator = fundingAccumulator.add(
            data['fundingCollected']
          ));
        data['underlyingCollected'] &&
          (underlyingAccumulator = underlyingAccumulator.add(
            data['underlyingCollected']
          ));
        return data;
      }
    );
    return { fundingAccumulator, premiumAccumulator, underlyingAccumulator };
  }, [atlanticPoolEpochData]);

  useEffect(() => {
    maxStrikesAccumulator;
  }, [maxStrikesAccumulator]);

  return (
    <TableContainer
      className={`rounded-xl border-umbra border border-b-0 max-h-80 w-full overflow-x-auto`}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader align="left" width={525}>
              Token <ArrowDownwardRoundedIcon className="p-1" />
            </TableHeader>
            <TableHeader align="right" width={5}>
              Locked
            </TableHeader>
            <TableHeader align="right" width={5}>
              Premia Collected
            </TableHeader>
            <TableHeader align="right" width={5}>
              Fees
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(assetsMapping).map((key, index) => {
            return (
              <TableRow className="py-2" key={index}>
                <TableBodyCell width={525}>
                  <Box className="flex space-x-2">
                    <img
                      src={`/images/tokens/${assetsMapping[key]}.svg`}
                      alt={assetsMapping[key]}
                      className="w-[2rem] h-auto my-auto"
                    />
                    <Box className="text-left my-auto">
                      <Typography variant="h6">{assetsMapping[key]}</Typography>
                      <Typography variant="h6" className="text-stieglitz">
                        {key}
                      </Typography>
                    </Box>
                  </Box>
                </TableBodyCell>
                <TableBodyCell width={5}>
                  <Box className="flex space-x-2 bg-umbra rounded-lg p-1 justify-between">
                    <Typography variant="h6" className="my-auto">
                      {'-'}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-stieglitz bg-mineshaft rounded-md p-1"
                    >
                      {assetsMapping[key]}
                    </Typography>
                  </Box>
                </TableBodyCell>
                <TableBodyCell align="right" width={5}>
                  <Box className="flex flex-col items-end">
                    <Typography variant="h6" className="my-auto text-stieglitz">
                      {'-'}
                    </Typography>
                  </Box>
                </TableBodyCell>
                <TableBodyCell align="right" width={5}>
                  <Box className="flex flex-col items-end">
                    <Typography variant="h6" className="text-stieglitz">
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
