import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { format, formatDistance } from 'date-fns';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import {
  AtlanticCallsPool__factory,
  AtlanticPutsPool__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import AlarmIcon from 'svgs/icons/AlarmIcon';

import { AtlanticsContext, IUserPosition } from 'contexts/Atlantics';
import { WalletContext } from 'contexts/Wallet';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

export const TableHeader = ({
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
      className="bg-cod-gray border-1 border-umbra py-3"
      sx={{ width }}
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
  const { provider, signer } = useContext(WalletContext);
  const { userPositions, selectedPool, selectedEpoch } =
    useContext(AtlanticsContext);

  const [canWithdraw, setCanWithdraw] = useState<boolean>(false);
  const [epochDuration, setEpochDuration] = useState<string>('0');

  const sendTx = useSendTx();

  useEffect(() => {
    (async () => {
      if (!selectedPool.state.expiryTime.gt(0) || !provider) return;
      const blockNumber = await provider.getBlockNumber();
      const timestamp = (await provider.getBlock(blockNumber)).timestamp;
      setCanWithdraw(timestamp > selectedPool.state.expiryTime.toNumber());
    })();
  }, [provider, selectedPool]);

  useEffect(() => {
    (async () => {
      const epochTimes = {
        startTime: selectedPool?.state.startTime ?? BigNumber.from(0),
        expiryTime: selectedPool?.state.expiryTime ?? BigNumber.from(0),
      };

      const duration = formatDistance(
        epochTimes['expiryTime'].toNumber() * 1000,
        Number(new Date())
      );

      setEpochDuration(duration);
    })();
  }, [selectedPool]);

  const tokenDecimals = useMemo(() => {
    if (!selectedPool)
      return {
        funding: 6,
        premium: 6,
        underlying: 18,
      };

    return {
      funding: selectedPool.isPut ? 6 : 18,
      premium: selectedPool.isPut ? 6 : 18,
      underlying: 18,
    };
  }, [selectedPool]);

  const handleWithdraw = useCallback(
    async (strike: number) => {
      if (
        !selectedPool?.contracts?.atlanticPool.address ||
        !selectedPool ||
        !selectedEpoch ||
        !signer
      ) {
        return;
      }

      const poolAddress = selectedPool.contracts.atlanticPool.address;
      try {
        if (selectedPool.isPut) {
          const apContract = AtlanticPutsPool__factory.connect(
            poolAddress,
            signer
          );
          await sendTx(apContract.withdraw(strike * 1e8, selectedEpoch));
        } else {
          const apContract = AtlanticCallsPool__factory.connect(
            poolAddress,
            signer
          );
          await sendTx(apContract.withdraw(selectedEpoch));
        }
      } catch (err) {
        console.log(err);
      }
    },
    [selectedEpoch, selectedPool, signer, sendTx]
  );

  return userPositions?.length !== 0 ? (
    <TableContainer className="rounded-xl max-h-80 w-full overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            {selectedPool?.isPut && <TableHeader>Max Strike</TableHeader>}
            <TableHeader>Deposit Date</TableHeader>
            <TableHeader>Liquidity</TableHeader>
            <TableHeader>Premia Collected</TableHeader>
            <TableHeader>Funding Collected</TableHeader>
            {selectedPool?.isPut && (
              <TableHeader>Underlying Collected</TableHeader>
            )}
            <TableHeader align="right">Settle</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {userPositions.map((position, index) => (
            <TableRow key={index}>
              {selectedPool?.isPut && (
                <TableBodyCell>
                  ${getUserReadableAmount(position?.strike ?? 0, 8)}
                </TableBodyCell>
              )}
              <TableBodyCell>
                <Typography variant="h6">
                  {format(
                    new Date(position.timestamp.toNumber() * 1000),
                    'd LLLL yyyy'
                  )}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
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
                  {formatAmount(
                    getUserReadableAmount(
                      position.fundingEarned,
                      tokenDecimals.funding
                    ),
                    3,
                    true
                  )}
                </Typography>
              </TableBodyCell>{' '}
              {selectedPool?.isPut && (
                <TableBodyCell>
                  <Typography variant="h6">
                    {formatAmount(
                      getUserReadableAmount(
                        position?.underlyingEarned ?? 0,
                        tokenDecimals.underlying
                      ),
                      3,
                      true
                    )}
                  </Typography>
                </TableBodyCell>
              )}
              <TableBodyCell align="right">
                <CustomButton
                  onClick={async () => {
                    await handleWithdraw(position?.strike?.toNumber() ?? 0);
                  }}
                  disabled={!canWithdraw}
                  color={canWithdraw ? 'primary' : 'mineshaft'}
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
    <Box className="w-full text-center bg-cod-gray rounded-xl p-4">
      <Typography variant="h6">No Deposits</Typography>
    </Box>
  );
};

export default UserDepositsTable;
