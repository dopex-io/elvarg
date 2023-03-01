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
import { getTokenDecimals } from 'utils/general';

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
  const { appUserData, appContractData, chainId } = useBoundStore();

  const writePositions = useMemo(() => {
    if (
      appUserData.writePositions.length === 0 ||
      !chainId ||
      !appContractData.collateralSymbol
    )
      return;
    return appUserData.writePositions.map((writePosition: WritePosition) => ({
      totalCollateral: getUserReadableAmount(
        writePosition.totalCollateral,
        getTokenDecimals(appContractData.collateralSymbol, chainId)
      ),
      activeCollateral: getUserReadableAmount(
        writePosition.activeCollateral,
        6
      ),
      accruedPremium: getUserReadableAmount(
        writePosition.accuredPremium,
        getTokenDecimals(appContractData.collateralSymbol, chainId)
      ),
      withdrawableCollateral: getUserReadableAmount(
        writePosition.withdrawableCollateral,
        getTokenDecimals(appContractData.collateralSymbol, chainId)
      ),
      positionId: Number(writePosition.positionId),
      withdrawable: writePosition.withdrawableCollateral.gt('0'),
      collateralSymbol: appContractData.collateralSymbol,
    }));
  }, [appContractData.collateralSymbol, appUserData.writePositions, chainId]);

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
