import { useMemo } from 'react';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import Typography from 'components/UI/Typography';
import TableRowData from 'components/perpetual-pools/DepositTable/TableRowData';

import { useBoundStore } from 'store';
import { WritePosition } from 'store/RdpxV2/perpetual-pools';

import { getUserReadableAmount } from 'utils/contracts';

// const writePositions = [
//   {
//     amount: '1231',
//     fundingEarned: '10',
//     withdrawableAmount: '0',
//     actionState: false,
//   },
// ];

// totalCollateral: BigNumber;
// activeCollateral: BigNumber;
// accuredPremium: BigNumber;
// withdrawableCollateral: BigNumber;
// rewardDistributionRatios: BigNumber[];
// strikes: Array<BigNumber>;
// lastUpdatedTime: BigNumber | number;
// lastUpdatedFundingPercentage: BigNumber;
// user: string;
// positionId: BigNumber | number;

const DepositTable = () => {
  const { appUserData } = useBoundStore();

  const writePositions = useMemo(() => {
    if (appUserData.writePositions.length === 0) return;
    return appUserData.writePositions.map((writePosition: WritePosition) => ({
      totalCollateral: getUserReadableAmount(writePosition.totalCollateral, 6),
      activeCollateral: getUserReadableAmount(
        writePosition.activeCollateral,
        6
      ),
      accruedPremium: getUserReadableAmount(writePosition.accuredPremium, 6),
      withdrawableCollateral: getUserReadableAmount(
        writePosition.withdrawableCollateral,
        6
      ),
      positionId: Number(writePosition.positionId),
      withdrawable: writePosition.withdrawableCollateral.gt('0'),
    }));
  }, [appUserData.writePositions]);

  return (
    <Box className="space-y-2">
      <Typography variant="h6">Deposits</Typography>
      {writePositions ? (
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
                    Active
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
              {writePositions?.map((writePosition, index) => (
                <TableRowData {...writePosition} key={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box className="bg-cod-gray w-full px-3 py-10 text-center rounded-xl">
          <Typography variant="h5" color="stieglitz">
            Nothing to show
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DepositTable;
