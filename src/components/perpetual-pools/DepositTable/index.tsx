import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import Typography from 'components/UI/Typography';
import TableRowData from 'components/perpetual-pools/DepositTable/TableRowData';

const writePositions = [
  {
    amount: '1231',
    fundingEarned: '10',
    withdrawableAmount: '0',
    actionState: false,
  },
];

const DepositTable = () => {
  return (
    <Box className="space-y-2">
      <Typography variant="h6">Deposits</Typography>
      <TableContainer className="bg-cod-gray rounded-xl">
        <Table>
          <TableHead>
            <TableRow className="p-3">
              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0 w-1/3"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Amount
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Earned
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Withdrawable
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                className="text-stieglitz bg-cod-gray border-0 pb-0"
              >
                <Typography variant="h6" className="text-stieglitz">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {writePositions.map((writePosition, index) => (
              <TableRowData {...writePosition} key={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepositTable;
