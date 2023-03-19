import { value useCallback, value useMemo } from 'react';

import { value BigNumber } from 'ethers';

import { value Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useSendTx from 'hooks/useSendTx';
import Countdown from 'react-countdown';
import { value useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import { value TableHeader } from 'components/straddles/Deposits/DepositsTable';

import { value getContractReadableAmount } from 'utils/contracts';
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
      try {
        await sendTx(
          optionScalpData?.optionScalpContract.connect(signer),
          'closePosition',
          [id]
        );
      } catch (e) {}
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
    if (!optionScalpData) return filtered;
    let { quoteDecimals, baseDecimals, inverted } = optionScalpData;

    if (!quoteDecimals || !baseDecimals) return;

    optionScalpUserData?.scalpPositions?.map((position) => {
      if (
        (tab === 'Open' && position.isOpen) ||
        (tab === 'Closed' && !position.isOpen)
      ) {
        const entry = formatAmount(
          inverted
            ? 1 /
                getUserReadableAmount(position.entry, quoteDecimals.toNumber())
            : getUserReadableAmount(position.entry, quoteDecimals.toNumber()),
          5
        );

        const liquidationPrice = formatAmount(
          inverted
            ? 1 /
                getUserReadableAmount(
                  position.liquidationPrice,
                  quoteDecimals.toNumber()
                )
            : getUserReadableAmount(
                position.liquidationPrice,
                quoteDecimals.toNumber()
              ),
          5
        );

        const positions = formatAmount(
          getUserReadableAmount(position.positions, quoteDecimals.toNumber()),
          5
        );

        const pnl = getUserReadableAmount(
          position.pnl,
          quoteDecimals.toNumber()
        );

        const closePrice = formatAmount(
          getUserReadableAmount(
            position.isShort
              ? position.entry.sub(
                  position.pnl
                    .mul(
                      getContractReadableAmount(quoteDecimals.toNumber(), 10)
                    )
                    .div(position.positions.abs())
                )
              : position.entry.add(
                  position.pnl
                    .mul(
                      getContractReadableAmount(quoteDecimals.toNumber(), 10)
                    )
                    .div(position.positions.abs())
                ),
            quoteDecimals.toNumber()
          ),
          5
        );

        filtered.push({
          ...position,
          entry,
          liquidationPrice,
          positions,
          pnl,
          closePrice,
        });
      }
    });
    return filtered;
  }, [optionScalpUserData, tab, optionScalpData]);

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
                            (
                              optionScalpData?.inverted
                                ? !position.isShort
                                : position.isShort
                            )
                              ? 'text-[#FF617D]'
                              : 'text-[#6DFFB9]'
                          }
                        >
                          {(
                            optionScalpData?.inverted
                              ? !position.isShort
                              : position.isShort
                          )
                            ? '-'
                            : '+'}

                          {position.positions}
                          {' ' + optionScalpData?.baseSymbol!}
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    {position.entry}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    {position.liquidationPrice}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" className="text-left">
                    <Tooltip title={position.pnl}>
                      <span
                        className={
                          position.pnl < 0 ? 'text-[#FF617D]' : 'text-[#6DFFB9]'
                        }
                      >
                        {optionScalpData?.quoteSymbol}{' '}
                        {formatAmount(position.pnl, 5)}
                      </span>
                    </Tooltip>
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    {optionScalpData?.quoteSymbol}{' '}
                    {getUserReadableAmount(
                      position.margin,
                      optionScalpData?.quoteDecimals!.toNumber()!
                    ).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" color="white" className="text-left">
                    {optionScalpData?.quoteSymbol}{' '}
                    {getUserReadableAmount(
                      position.premium,
                      optionScalpData?.quoteDecimals!.toNumber()!
                    ).toFixed(2)}
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
                        {position.closePrice}
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
