import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import Countdown from 'react-countdown';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import { TableHeader } from 'components/straddles/Deposits/DepositsTable';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const PositionsTable = ({ tab }: { tab: string }) => {
  const sendTx = useSendTx();

  const {
    signer,
    optionScalpUserData,
    optionScalpData,
    updateOptionScalp,
    updateOptionScalpUserData,
  } = useBoundStore();

  const handleClose = useCallback(
    async (id: BigNumber) => {
      await sendTx(
        optionScalpData?.optionScalpContract.connect(signer),
        'closePosition',
        [id]
      );
      await updateOptionScalp();
      await updateOptionScalpUserData();
    },
    [
      optionScalpData,
      signer,
      sendTx,
      updateOptionScalp,
      updateOptionScalpUserData,
    ]
  );

  const positions = useMemo(() => {
    const filtered: any = [];
    optionScalpUserData?.scalpPositions?.map((position) => {
      if (
        (tab === 'Open' && position.isOpen) ||
        (tab === 'Closed' && !position.isOpen)
      )
        filtered.push(position);
    });
    return filtered;
  }, [optionScalpUserData, tab]);

  return (
    <Box>
      <TableContainer className="rounded-xl">
        <Table className="rounded-xl">
          <TableHead className="rounded-xl">
            <TableRow>
              <TableHeader label="Pos. Size" showArrowIcon />
              <TableHeader label="Average Open Price" />
              <TableHeader label="Liq. Price" />
              <TableHeader label="PnL" />
              <TableHeader label="Margin" />
              <TableHeader label="Premium" />
              {tab === 'Open' ? (
                <TableHeader label="Expiry" />
              ) : (
                <TableHeader label="Close Price" />
              )}
              <TableHeader label="Timeframe" />
            </TableRow>
          </TableHead>
          <TableBody className="rounded-lg">
            {positions.map((position: any, i: number) => (
              <TableRow key={i}>
                <TableCell className="pt-2 border-0">
                  <Box>
                    <Box
                      className={`rounded-md flex items-center px-2 py-2 w-fit`}
                    >
                      <Typography variant="h6" className={'pr-7 pt-[2px]'}>
                        <span
                          className={
                            position.isShort
                              ? 'text-[#FF617D]'
                              : 'text-[#6DFFB9]'
                          }
                        >
                          {position.isShort ? '-' : '+'}
                          {formatAmount(
                            getUserReadableAmount(position.positions, 8),
                            8
                          )}
                          {' ETH'}
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.entry, 8).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    $
                    {getUserReadableAmount(
                      position.liquidationPrice,
                      8
                    ).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" className="text-left">
                    <span
                      className={
                        position.pnl.lt(0) ? 'text-[#FF617D]' : 'text-[#6DFFB9]'
                      }
                    >
                      ${getUserReadableAmount(position.pnl, 6).toFixed(2)}
                    </span>
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.margin, 6).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    ${getUserReadableAmount(position.premium, 6).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    {position.isOpen ? (
                      <Countdown
                        date={
                          new Date(
                            Number(
                              BigNumber.from('1000').mul(
                                position.openedAt.add(position.timeframe)
                              )
                            )
                          )
                        }
                        renderer={({ minutes, seconds }) => {
                          return (
                            <Typography
                              variant="h5"
                              className="text-stieglitz mr-1"
                            >
                              {minutes}m {seconds}s
                            </Typography>
                          );
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        color="white"
                        className="text-left"
                      >
                        $
                        {getUserReadableAmount(
                          position.isShort
                            ? position.entry.add(
                                position.positions
                                  .abs()
                                  .mul(position.pnl)
                                  .div('1000000')
                              )
                            : position.entry.sub(
                                position.positions
                                  .abs()
                                  .mul(position.pnl)
                                  .div('1000000')
                              ),
                          8
                        ).toFixed(2)}
                      </Typography>
                    )}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    {Number(position.timeframe) / 60}m
                  </Typography>
                </TableCell>
                {position.isOpen ? (
                  <TableCell className="flex justify-end border-0">
                    <CustomButton
                      className="cursor-pointer text-white"
                      color={'primary'}
                      onClick={() => handleClose(position.id)}
                    >
                      Close
                    </CustomButton>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {positions.length === 0 ? (
          <Box className="w-full flex my-8">
            <span className="ml-auto mr-auto">
              Your {tab === 'Open' ? 'active' : 'closed'} positions will appear
              here
            </span>
          </Box>
        ) : null}
      </TableContainer>
      <Box className="flex">
        {optionScalpUserData?.scalpPositions?.length === 0 ? (
          <Box className="text-center mt-3 mb-3 ml-auto w-full">-</Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default PositionsTable;
