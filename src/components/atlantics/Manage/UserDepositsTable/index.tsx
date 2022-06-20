import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { format, formatDistance } from 'date-fns';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
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

import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

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
      className="bg-cod-gray border-1 border-umbra py-3"
      sx={{ width }}
    >
      <Typography variant="h6" color={textColor}>
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

const UserDepositsTable = () => {
  const { chainId, provider, signer } = useContext(WalletContext);
  const { userPositions, selectedPool, revenue, selectedEpoch } =
    useContext(AtlanticsContext);

  const [canWithdraw, setCanWithdraw] = useState<boolean>(true);
  const [epochDuration, setEpochDuration] = useState<string>('0');

  const tx = useSendTx();

  useEffect(() => {
    (async () => {
      if (!selectedPool || !provider) return;
      const blockNumber = await provider.getBlockNumber();
      const timestamp = (await provider.getBlock(blockNumber)).timestamp;
      if (timestamp > Number(selectedPool.state.expiryTime)) {
        setCanWithdraw(() => false);
      }
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

  const userPositionDataSanitized = useMemo(() => {
    if (!selectedPool) return [];
    if (userPositions && userPositions.length !== 0) {
      const tokenDecimals = getTokenDecimals(
        selectedPool.tokens.deposit,
        chainId
      );
      const positions = userPositions.map((_position: IUserPosition, index) => {
        return {
          strike: _position.strike && _position.strike.toNumber(),
          liquidity: Number(_position.liquidity) / 10 ** tokenDecimals,
          timestamp: Number(_position.timestamp),
          premium: Number(revenue[index]?.premium) / 10 ** tokenDecimals,
          funding: Number(revenue[index]?.funding) / 10 ** tokenDecimals,
          underlying: Number(revenue[index]?.underlying) / 10 ** 18,
        };
      });
      return positions;
    }
    return [];
  }, [userPositions, chainId, selectedPool, revenue]);

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
      if (selectedPool.isPut) {
        const apContract = AtlanticPutsPool__factory.connect(
          poolAddress,
          signer
        );
        tx(apContract.withdraw(strike * 1e8, selectedEpoch));
      } else {
        const apContract = AtlanticCallsPool__factory.connect(
          poolAddress,
          signer
        );
        tx(apContract.withdraw(selectedEpoch));
      }
    },
    [selectedEpoch, selectedPool, signer, tx]
  );

  return userPositions?.length !== 0 ? (
    <TableContainer className="rounded-xl max-h-80 w-full overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            {selectedPool?.isPut && (
              <TableHeader>
                Max Strike <ArrowDownwardRoundedIcon className="p-1 my-auto" />
              </TableHeader>
            )}
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
          {userPositionDataSanitized.map((position, index) => (
            <TableRow key={index}>
              {selectedPool?.isPut && (
                <TableBodyCell>
                  <ArrowUpward className="h-[0.8rem]" />${position.strike}
                </TableBodyCell>
              )}
              <TableBodyCell>
                <Typography variant="h6">
                  {format(new Date(position.timestamp * 1000), 'd LLLL yyyy')}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {formatAmount(position.liquidity, 3, true)}{' '}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {formatAmount(position.premium, 3, true)}
                </Typography>
              </TableBodyCell>
              <TableBodyCell>
                <Typography variant="h6">
                  {formatAmount(position.funding, 3, true)}
                </Typography>
              </TableBodyCell>{' '}
              {selectedPool?.isPut && (
                <TableBodyCell>
                  <Typography variant="h6">
                    {formatAmount(position.underlying, 3, true)}
                  </Typography>
                </TableBodyCell>
              )}
              <TableBodyCell align="right">
                <CustomButton
                  onClick={async () => {
                    await handleWithdraw(position.strike ?? 0);
                  }}
                  disabled={!canWithdraw}
                  color={canWithdraw ? 'primary' : 'mineshaft'}
                  className="p-2 rounded-lg"
                >
                  {canWithdraw ? (
                    <Typography variant="h6" className="my-auto p-3">
                      Withdraw
                    </Typography>
                  ) : (
                    <>
                      <AlarmIcon fill="#8E8E8E" />
                      <Typography variant="h6" className="my-auto ml-2">
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
