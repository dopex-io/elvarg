import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, formatDistance } from 'date-fns';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import WalletButton from 'components/common/WalletButton';

import AlarmIcon from 'svgs/icons/AlarmIcon';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export const TableHeader = ({
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'stieglitz',
  width = 'w-auto',
}) => {
  return (
    // @ts-ignore TODO: FIX
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className={`bg-cod-gray border-1 border-umbra py-3 ${width}`}
    >
      <Typography variant="h6" color={textColor}>
        {children}
      </Typography>
    </TableCell>
  );
};

export const TableBodyCell = ({
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

const UserDepositsTable = () => {
  const { provider, signer } = useBoundStore();
  const {
    accountAddress,
    userPositions,
    atlanticPool,
    atlanticPoolEpochData,
    selectedEpoch,
    updateUserPositions,
  } = useBoundStore();

  const [canWithdraw, setCanWithdraw] = useState<boolean>(false);
  const [epochDuration, setEpochDuration] = useState<string>('0');

  const sendTx = useSendTx();

  useEffect(() => {
    if (!atlanticPoolEpochData) return;
    (async () => {
      if (!atlanticPoolEpochData.expiry.gt(0) || !provider) return;
      const blockNumber = await provider.getBlockNumber();
      const timestamp = (await provider.getBlock(blockNumber)).timestamp;
      setCanWithdraw(timestamp > atlanticPoolEpochData.expiry.toNumber());
    })();
  }, [provider, atlanticPoolEpochData]);

  useEffect(() => {
    if (!atlanticPool || !atlanticPoolEpochData) return;
    updateUserPositions();
  }, [atlanticPool, atlanticPoolEpochData, updateUserPositions]);

  useEffect(() => {
    if (!atlanticPoolEpochData) return;
    (async () => {
      const epochTimes = {
        startTime: atlanticPoolEpochData.startTime,
        expiryTime: atlanticPoolEpochData.expiry,
      };

      const duration = formatDistance(
        epochTimes['expiryTime'].toNumber() * 1000,
        Number(new Date())
      );

      setEpochDuration(duration);
    })();
  }, [atlanticPoolEpochData]);

  const tokenDecimals = useMemo(() => {
    if (!atlanticPoolEpochData)
      return {
        funding: 6,
        premium: 6,
        underlying: 18,
      };

    return {
      // funding: selectedPool.isPut ? 6 : 18,
      funding: 6,
      // premium: selectedPool.isPut ? 6 : 18,
      premium: 6,
      underlying: 18,
    };
  }, [atlanticPoolEpochData]);

  const handleWithdraw = useCallback(
    async (depositId: number) => {
      if (!atlanticPool || !selectedEpoch || !signer) {
        return;
      }
      try {
        const apContract = atlanticPool.contracts.atlanticPool.connect(signer);
        await sendTx(apContract.withdraw(depositId));
      } catch (err) {
        console.log(err);
      }
    },
    [selectedEpoch, atlanticPool, signer, sendTx]
  );

  const userPositionsRenderState = useMemo(() => {
    if (!accountAddress)
      return (
        <Box className="w-full text-center bg-cod-gray rounded-xl">
          <WalletButton>Connect</WalletButton>
        </Box>
      );
    else if (!userPositions) {
      return <CircularProgress />;
    } else if (userPositions.length === 0)
      return (
        <Typography variant="h6" className="my-2">
          No Deposits
        </Typography>
      );
    else return 'renderTable';
  }, [accountAddress, userPositions]);

  return userPositionsRenderState === 'renderTable' ? (
    <TableContainer className="rounded-xl max-h-80 w-full overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader width="w-1/6">Max Strike</TableHeader>
            <TableHeader>Deposit</TableHeader>
            <TableHeader>Liquidity</TableHeader>
            <TableHeader width="w-1/6">Premia Earned</TableHeader>
            <TableHeader width="w-1/6">Funding Earned</TableHeader>
            <TableHeader width="w-1/6">
              {atlanticPool?.tokens.underlying} Collected
            </TableHeader>
            <TableHeader>APY</TableHeader>
            <TableHeader align="right" width="w-1/6">
              Settle
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {userPositions?.map((position, index) => (
            <TableRow key={index}>
              {
                <TableBodyCell>
                  ${getUserReadableAmount(position?.strike ?? 0, 8)}
                </TableBodyCell>
              }
              <TableBodyCell>
                <Typography variant="h6">
                  {format(
                    new Date(position.timestamp.toNumber() * 1000),
                    'd LLL yyyy'
                  )}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  $
                  {formatAmount(
                    getUserReadableAmount(
                      position.liquidity,
                      tokenDecimals.premium
                    ),
                    3,
                    true
                  )}{' '}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  $
                  {formatAmount(
                    getUserReadableAmount(
                      position.premiumsEarned,
                      tokenDecimals.premium
                    ),
                    3,
                    true
                  )}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  $
                  {formatAmount(
                    getUserReadableAmount(
                      position.fundingEarned,
                      tokenDecimals.funding
                    ),
                    3,
                    true
                  )}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {formatAmount(
                    getUserReadableAmount(
                      position?.underlyingEarned ?? 0,
                      tokenDecimals.underlying
                    ),
                    3,
                    true
                  )}{' '}
                  {atlanticPool?.tokens.underlying}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {formatAmount(position.apy, 8, true) + '%'}
                </Typography>
              </TableBodyCell>
              <TableBodyCell align="right">
                <CustomButton
                  onClick={async () => {
                    await handleWithdraw(position.depositId!);
                  }}
                  disabled={!canWithdraw}
                  color={!canWithdraw ? 'mineshaft' : 'primary'}
                  className="rounded-md"
                >
                  {canWithdraw ? (
                    <Typography variant="h6" className="my-auto">
                      Withdraw
                    </Typography>
                  ) : (
                    <>
                      <AlarmIcon fill="#8E8E8E" />
                      <Typography variant="h6" className="ml-2">
                        {epochDuration}
                      </Typography>
                    </>
                  )}
                </CustomButton>
              </TableBodyCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box className="w-full text-center bg-cod-gray rounded-xl py-8">
      {userPositionsRenderState}
    </Box>
  );
};

export default UserDepositsTable;
