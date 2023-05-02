import Head from 'next/head';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import cx from 'classnames';
import Countdown from 'react-countdown';
import { useBoundStore } from 'store';

import AppBar from 'components/common/AppBar';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount, smartTrim } from 'utils/general';

const TOKENS = ['ARB', 'ETH'];
const RESPONSIVE_TITLE_TEXT_STYLE = 'text-xs md:text-sm lg:text-md';
const SORT_OPTIONS = ['PNL', 'VOLUME'];

const LeaderBoard = () => {
  const { getUserPositionData, accountAddress } = useBoundStore();
  const [showMore, setShowMore] = useState(false);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [positions, setPositions] = useState([]);

  const updatePositions = useCallback(async () => {
    await getUserPositionData().then((result: any) => {
      if (result) {
        setPositions(result);
      }
    });
  }, [getUserPositionData]);

  const leaderBoardData = useMemo(() => {
    const traders = positions.length;
    let _positionsFiltered = positions;

    if (SORT_OPTIONS[0] === sort) {
      _positionsFiltered = _positionsFiltered.sort(
        (a: any, b: any) => parseFloat(b.totalPnL) - parseFloat(a.totalPnL)
      );
    } else if (SORT_OPTIONS[1] === sort) {
      _positionsFiltered = _positionsFiltered.sort(
        (a: any, b: any) =>
          parseFloat(b.totalVolume) - parseFloat(a.totalVolume)
      );
    }

    _positionsFiltered = !showMore ? positions.slice(0, 5) : positions;

    const index = positions.findIndex((position: any) => {
      return position.id.toLowerCase() === accountAddress?.toLowerCase();
    });

    return {
      traders: traders,
      positions: _positionsFiltered,
      userRank: index === -1 ? 0 : index + 1,
    };
  }, [accountAddress, positions, sort, showMore]);

  useEffect(() => {
    updatePositions();
  }, [updatePositions]);

  return (
    <div className="h-screen w-screen flex flex-col space-y-6 items-center p-[3rem] mt-[3rem]">
      <Head>
        <title>Leaderboard | Option Scalps </title>
      </Head>
      <AppBar />
      {/* Title */}
      <div className="w-full flex flex-col items-center space-y-4">
        <h4
          className={cx(
            RESPONSIVE_TITLE_TEXT_STYLE,
            'font-bold uppercase tracking-widest'
          )}
        >
          Option Scalps Leaderboard
        </h4>
        {/* Tokens */}
      </div>
      {/* Table */}
      <div className="h-fit-content w-screen px-[2rem] md:px-[5rem] max-w-[55rem]">
        <div className="h-full w-full rounded-xl bg-cod-gray p-5 divide-y divide-mineshaft">
          <div className="flex w-full flex-col divide-y divide-mineshaft">
            <div>
              <div className="flex w-full h-full justify-between px-4 mb-2 bg-umbra rounded-lg py-2">
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                  {leaderBoardData.traders} Traders
                </span>
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                  Your Rank{' '}
                  {leaderBoardData.userRank === 0
                    ? '-'
                    : '#' + leaderBoardData.userRank}
                </span>
                <div className="flex space-x-4">
                  <div
                    className={cx(
                      'rounded-md',
                      sort === SORT_OPTIONS[1] &&
                        'border border-mineshaft bg-mineshaft'
                    )}
                  >
                    <EqualizerIcon
                      className="text-[1.8rem]"
                      role="button"
                      onClick={() => setSort(SORT_OPTIONS[1])}
                    />
                  </div>
                  <div
                    className={cx(
                      'rounded-md',
                      sort === SORT_OPTIONS[0] &&
                        'border border-mineshaft bg-mineshaft'
                    )}
                  >
                    <AttachMoneyIcon
                      className="text-[1.8rem]"
                      role="button"
                      onClick={() => setSort(SORT_OPTIONS[0])}
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-y-1 divide-mineshaft">
                <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
                  <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>Rank</span>
                  <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                    Trader
                  </span>
                  <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                    {sort === SORT_OPTIONS[0] ? 'PnL' : 'Volume'}
                  </span>
                </div>
                {leaderBoardData.positions.map(
                  (position: any, index: number) => (
                    <div
                      key={index}
                      // px-4 py-3 md:px-14 md:py-5
                      className={cx(
                        index + 1 === Number(leaderBoardData.userRank) &&
                          'animate-pulse',
                        'flex flex-row justify-between items-center px-4 py-3 md:px-14 md:py-5'
                      )}
                    >
                      <span
                        className={cx(
                          RESPONSIVE_TITLE_TEXT_STYLE,
                          'text-left w-full'
                        )}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={cx(
                          RESPONSIVE_TITLE_TEXT_STYLE,
                          'text-center w-full overflow-x-scroll sm:overflow-x-visible'
                        )}
                      >
                        {smartTrim(position.id, 0)}
                      </span>
                      <span
                        className={cx(
                          RESPONSIVE_TITLE_TEXT_STYLE,
                          'text-right w-full'
                        )}
                      >
                        $
                        {formatAmount(
                          getUserReadableAmount(
                            sort === SORT_OPTIONS[0]
                              ? position.totalPnL
                              : position.totalVolume,
                            6
                          ),
                          2
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Show more */}
            <div
              className="w-full pt-4"
              role="button"
              onClick={() => setShowMore((prev) => !prev)}
            >
              <div className="flex flex-row w-full justify-center">
                {!showMore ? (
                  <KeyboardArrowDown className="text-[1.5rem]" />
                ) : (
                  <KeyboardArrowUp className="text-[1.5rem]" />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Trade prompt */}
      </div>
      <div className="flex flex-col items-center space-y-6 pb-10 h-full">
        <div className="flex flex-row space-x-4">
          {TOKENS.map((token, index) => (
            <a key={index} role="button" href={`/scalps/${token}`}>
              <span
                role="button"
                className={cx(
                  RESPONSIVE_TITLE_TEXT_STYLE,
                  'mx-4 my-4 flex flex-col-reverse  items-center font-lighter underline-offset-4'
                )}
                key={index}
              >
                <span className="underline hover:text-stieglitz">
                  Trade {token}
                </span>
                <img
                  className="w-9 h-9 z-10 border border-gray-500 rounded-full mb-2"
                  src={`/images/tokens/${token.toLowerCase()}.svg`}
                  alt={token}
                />
              </span>
            </a>
          ))}
        </div>
        <div
          role="button"
          className="flex flex-row space-x-4 w-full items-center justify-center px-10"
        >
          <a
            href={
              'https://blog.dopex.io/articles/product-launches-updates/introducing-option-scalps'
            }
            className={cx(
              RESPONSIVE_TITLE_TEXT_STYLE,
              'flex-1 rounded-md bg-primary py-2 px-5 max-w-[10rem] flex'
            )}
          >
            <span className="text-center w-full">Learn More</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
