import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';

import { IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IosShare from '@mui/icons-material/IosShare';

import Countdown from 'react-countdown';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';
import useShare from 'hooks/useShare';

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
    uniArbPrice,
    uniWethPrice,
    selectedPoolName,
  } = useBoundStore();

  const markPrice = useMemo(() => {
    if (selectedPoolName === 'ETH') return uniWethPrice;
    else if (selectedPoolName === 'ARB') return uniArbPrice;
    return BigNumber.from('0');
  }, [uniWethPrice, uniArbPrice, selectedPoolName]);

  const share = useShare((state) => state.open);

  const handleShare = useCallback(
    (position: any) => {
      const { entry, pnl, margin, size } = position;


      const leverage = size / margin;

      const _percPnl = (pnl / margin) * 100;

      if (!optionScalpData) return;
      const { baseSymbol, quoteSymbol } = optionScalpData;

      if (!baseSymbol || !quoteSymbol || !markPrice) return;

      share({
        title: (
          <Typography variant="h5" className="font-bold shadow-2xl">
            <span className="text-green-500">Long</span>
            {' | '}
            <span>{formatAmount(leverage, 1)}x</span>
            {' | '}
            <span>{`${baseSymbol}${quoteSymbol}`}</span>
          </Typography>
        ),
        percentage: _percPnl,
        customPath: `https://dapp-git-feat-option-scalps-dopex-io.vercel.app/scalps/${selectedPoolName}`,
        stats: [
          { name: 'Entry Price', value: `$${entry}` },
          {
            name: 'Mark Price',
            value: `$${formatAmount(getUserReadableAmount(markPrice, 6), 4)}`,
          },
        ],
      });
    },
    [share, optionScalpData, markPrice, selectedPoolName]
  );

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
          4
        );

        const size = getUserReadableAmount(
          position.size,
          quoteDecimals.toNumber()
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
          4
        );

        const positions = formatAmount(
          getUserReadableAmount(position.positions, quoteDecimals.toNumber()),
          5
        );

        const pnl = getUserReadableAmount(
          position.pnl,
          quoteDecimals.toNumber()
        );

        const closePrice = getUserReadableAmount(
          position.isShort
            ? position.entry.sub(
                position.pnl
                  .mul(10 ** optionScalpData!.quoteDecimals!.toNumber())
                  .div(position.positions.abs())
              )
            : position.entry.add(
                position.pnl
                  .mul(10 ** optionScalpData!.quoteDecimals!.toNumber())
                  .div(position.positions.abs())
              ),
          optionScalpData?.quoteDecimals!.toNumber()!
        ).toFixed(2);

        const margin = formatAmount(
          getUserReadableAmount(position.margin, quoteDecimals.toNumber()),
          5
        );

        {
          getUserReadableAmount(
            position.premium,
            optionScalpData?.quoteDecimals!.toNumber()!
          ).toFixed(2);
        }

        const premium = formatAmount(
          getUserReadableAmount(position.premium, quoteDecimals.toNumber()),
          5
        );

        filtered.push({
          ...position,
          entry,
          liquidationPrice,
          positions,
          pnl,
          closePrice,
          margin,
          premium,
          size,
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
              <TableHeader label="Avg. Open Price" />
              {tab === 'Open' ? <TableHeader label="Liq. Price" /> : null}
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
                      <Typography
                        variant="h6"
                        className={'pr-7 pt-[2px] text-[0.8rem]'}
                      >
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
                  <Typography
                    variant="h6"
                    color="white"
                    className="text-left text-[0.8rem]"
                  >
                    {position.entry}
                  </Typography>
                </TableCell>
                {tab === 'Open' ? (
                  <TableCell className="pt-1 border-0">
                    <Typography
                      variant="h6"
                      color="white"
                      className="text-left text-[0.8rem]"
                    >
                      {position.liquidationPrice}
                    </Typography>
                  </TableCell>
                ) : null}
                <TableCell className="pt-1 border-0">
                  <Typography variant="h6" className="text-left text-[0.8rem]">
                    <Tooltip title={position.pnl}>
                      <span
                        className={
                          position.pnl < 0 ? 'text-[#FF617D]' : 'text-[#6DFFB9]'
                        }
                      >
                        {optionScalpData?.quoteSymbol}{' '}
                        {formatAmount(position.pnl, 5)} ({' '}
                        {formatAmount(
                          (position.pnl / parseFloat(position.margin)) * 100,
                          2
                        )}
                        %)
                      </span>
                    </Tooltip>
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography
                    variant="h6"
                    color="white"
                    className="text-left text-[0.8rem]"
                  >
                    {optionScalpData?.quoteSymbol} {position.margin}{' '}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography
                    variant="h6"
                    color="white"
                    className="text-left text-[0.8rem]"
                  >
                    {optionScalpData?.quoteSymbol} {position.premium}
                  </Typography>
                </TableCell>
                <TableCell className="pt-1 border-0">
                  <Typography
                    variant="h6"
                    color="white"
                    className="text-left text-[0.8rem]"
                  >
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
                  <Typography
                    variant="h6"
                    color="white"
                    className="text-left text-[0.8rem]"
                  >
                    {Number(position.timeframe) / 60}m
                  </Typography>
                </TableCell>
                {position.isOpen ? (
                  <TableCell className="flex justify-end border-0">
                    <CustomButton
                      size="small"
                      className="cursor-pointer text-white"
                      color={'primary'}
                      onClick={() => handleClose(position.id)}
                    >
                      Close
                    </CustomButton>
                    <IconButton
                      aria-label="share"
                      aria-haspopup="true"
                      onClick={() => handleShare(position)}
                      className="flex"
                      size="small"
                    >
                      <IosShare className="fill-current text-white opacity-90 hover:opacity-100 mb-0.5 pb-0.5" />
                    </IconButton>
                  </TableCell>
                ) : (
                  <IconButton
                    aria-label="share"
                    aria-haspopup="true"
                    onClick={() => handleShare(position)}
                    className="flex"
                    size="small"
                  >
                    <IosShare className="fill-current text-white opacity-90 hover:opacity-100 mt-1 pt-1" />
                  </IconButton>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {positions.length === 0 ? (
          <Box className="w-full flex my-8">
            <span className="ml-auto mr-auto text-[0.8rem]">
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
