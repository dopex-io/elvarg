import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import Typography from 'components/UI/Typography';

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

  return (
    <TableContainer
      className={`rounded-xl border-umbra border border-b-0 max-h-80`}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader align="left" width={600}>
              Token <ArrowDownwardRoundedIcon />
            </TableHeader>
            <TableHeader align="left" width={5}>
              Amount
            </TableHeader>
            <TableHeader align="right" width={5}>
              Pool Profit
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className="py-2">
            <TableBodyCell width={600}>
              <Box className="flex space-x-2">
                <img
                  src={`/images/tokens/${collateral}.svg`}
                  alt={collateral}
                  className="w-[2rem] h-auto my-auto"
                />
                <Box className="text-left my-auto">
                  <Typography variant="h6">{collateral}</Typography>
                  <Typography variant="h6" className="text-stieglitz">
                    Collateral
                  </Typography>
                </Box>
              </Box>
            </TableBodyCell>
            <TableBodyCell width={5}>
              <Box className="flex space-x-2 bg-umbra rounded-md p-1 justify-between">
                <Typography variant="h6" className="my-auto">
                  {'34.1m'}
                </Typography>
                <Typography
                  variant="h6"
                  className="text-stieglitz bg-mineshaft rounded-md p-1"
                >
                  {collateral}
                </Typography>
              </Box>
            </TableBodyCell>
            <TableBodyCell align="right" width={5}>
              <Box className="flex flex-col items-end">
                <Typography variant="h6" className="my-auto text-up-only">
                  {'95.031'} {collateral}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  {'~$3,420'}
                </Typography>
              </Box>
            </TableBodyCell>
          </TableRow>
          <TableRow>
            <TableBodyCell>
              <Box className="flex space-x-2" width={600}>
                <img
                  src={`/images/tokens/${underlying}.svg`}
                  alt={underlying}
                  className="w-[2rem] h-auto my-auto"
                />
                <Box className="text-left my-auto">
                  <Typography variant="h6">{underlying}</Typography>
                  <Typography variant="h6" className="text-stieglitz">
                    {'Underlying'}
                  </Typography>
                </Box>
              </Box>
            </TableBodyCell>
            <TableBodyCell width={5}>
              <Box className="flex space-x-2 bg-umbra rounded-md p-1 justify-between">
                <Typography variant="h6" className="my-auto">
                  {'3,420'}
                </Typography>
                <Typography
                  variant="h6"
                  className="text-stieglitz bg-mineshaft rounded-md p-1"
                >
                  {underlying}
                </Typography>
              </Box>
            </TableBodyCell>
            <TableBodyCell align="left" width={5}>
              <Box className="flex flex-col items-end">
                <Typography variant="h6" className="my-auto text-up-only">
                  {'3,425'} {underlying}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  {'~$3,420'}
                </Typography>
              </Box>
            </TableBodyCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PoolCompositionTable;
