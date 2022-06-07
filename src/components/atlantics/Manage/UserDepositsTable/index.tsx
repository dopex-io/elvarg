import { useContext, useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

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

interface UserDepositsTableProps {
  data: any[];
}
const UserDepositsTable = (props: UserDepositsTableProps) => {
  // @ts-ignore todo: FIX
  const { data } = props;

  const { userAtlanticsData, atlanticPoolEpochData, selectedEpoch } =
    useContext(AtlanticsContext);

  const [epochDuration, setEpochDuration] = useState('');

  console.log(atlanticPoolEpochData.isEpochExpired);

  console.log(userAtlanticsData);

  useEffect(() => {
    (async () => {
      if (!atlanticPoolEpochData) return;
      const epochTimes = atlanticPoolEpochData.epochTimes;

      const duration = formatDistance(
        epochTimes['expiryTime']!.toNumber() * 1000,
        epochTimes['startTime']!.toNumber() * 1000
      );

      setEpochDuration(duration);
    })();
  }, [atlanticPoolEpochData]);

  return (
    <TableContainer
      className={`rounded-xl border-umbra border border-b-0 max-h-80 w-full overflow-x-auto`}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              Max Strike <ArrowDownwardRoundedIcon className="p-1 my-auto" />
            </TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Fee Collected</TableHeader>
            <TableHeader>Epoch</TableHeader>
            <TableHeader align="right">Settle</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {userAtlanticsData.userPositions.map((position, index) => (
            <TableRow key={index}>
              <TableBodyCell>
                <Typography variant="h6">
                  {getUserReadableAmount(position.maxStrike, 18)}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {getUserReadableAmount(position.userDeposit, 18)}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {getUserReadableAmount(position.feeCollected, 18)} {'WETH'}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">{position.epoch}</Typography>
              </TableBodyCell>
              <TableBodyCell align="right">
                <Typography variant="h6">
                  <CustomButton
                    onClick={() => {
                      console.log('deez');
                    }}
                    disabled={!atlanticPoolEpochData.isEpochExpired}
                    color={
                      atlanticPoolEpochData.isEpochExpired
                        ? 'primary'
                        : 'mineshaft'
                    }
                  >
                    {atlanticPoolEpochData.isEpochExpired
                      ? 'Settle'
                      : epochDuration}
                  </CustomButton>
                </Typography>
              </TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserDepositsTable;
