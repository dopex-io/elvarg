import { useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { format, formatDistance } from 'date-fns';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import AlarmIcon from 'svgs/icons/AlarmIcon';

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
  underlying: string;
  collateral: string;
}

const UserDepositsTable = (props: UserDepositsTableProps) => {
  const { underlying, collateral } = props;

  const { userPositions, selectedPool } = useContext(AtlanticsContext);

  const [epochDuration, setEpochDuration] = useState('');

  useEffect(() => {
    (async () => {
      const epochTimes = {
        startTime: selectedPool?.state.startTime ?? BigNumber.from(0),
        expiryTime: selectedPool?.state.expiryTime ?? BigNumber.from(0),
      };

      const duration = formatDistance(
        epochTimes['expiryTime'].toNumber() * 1000,
        epochTimes['startTime'].toNumber() * 1000
      );

      setEpochDuration(duration);
    })();
  }, [selectedPool]);

  return userPositions?.length! > 0 ? (
    <TableContainer className={`rounded-xl max-h-80 w-full overflow-x-auto`}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              Max Strike <ArrowDownwardRoundedIcon className="p-1 my-auto" />
            </TableHeader>
            <TableHeader>Time</TableHeader>
            <TableHeader>Liquidity</TableHeader>
            <TableHeader>Fee Collected</TableHeader>
            <TableHeader align="right">Settle</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {userPositions?.map((position, index) => (
            <TableRow key={index}>
              <TableBodyCell>
                {/* Placeholder for strike */}
                <Typography variant="h6">{index}</Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {format(new Date(position.timestamp * 1000), 'd LLLL yyyy')}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {getUserReadableAmount(position.liquidity, 6)} {collateral}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {getUserReadableAmount(position.premiumDistributionRatio, 18)}{' '}
                  {underlying}
                </Typography>
              </TableBodyCell>
              <TableBodyCell align="right">
                <CustomButton
                  onClick={() => {
                    console.log('Clicked');
                  }}
                  disabled={true}
                  color={'mineshaft'}
                  className="space-x-3 p-2 rounded-lg bg-umbra"
                >
                  <AlarmIcon fill="#8E8E8E" />
                  <Typography variant="h6" className="my-auto">
                    {epochDuration}
                  </Typography>
                </CustomButton>
              </TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

export default UserDepositsTable;
