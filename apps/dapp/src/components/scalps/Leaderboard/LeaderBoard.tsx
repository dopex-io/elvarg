import React, { useState } from 'react';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import Head from 'next/head';
import cx from 'classnames';

import AppBar from 'components/common/AppBar';
import { CustomButton } from 'components/UI';

const TOKENS = ['ARB', 'ETH'];
const RESPONSIVE_TITLE_TEXT_STYLE = 'text-sm md:text-md lg:text-lg';
const SORT_OPTIONS = ['PNL', 'VOLUME'];

const LeaderBoard = () => {
  const [selectedToken, setSelectedToken] = useState('ARB');
  const [showMore, setShowMore] = useState(false);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
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
        <div className="flex flex-row space-x-4">
          {TOKENS.map((token, index) => (
            <span
              role="button"
              onClick={() => setSelectedToken(token)}
              className={cx(
                RESPONSIVE_TITLE_TEXT_STYLE,
                'mx-4 mt-4 flex flex-col-reverse font-lighter underline-offset-3',
                selectedToken === token && 'underline'
              )}
              key={index}
            >
              {token}
              <img
                className="w-9 h-9 z-10 border border-gray-500 rounded-full mb-2"
                src={`/images/tokens/${token.toLowerCase()}.svg`}
                alt={token}
              />
            </span>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="h-fit-content w-screen px-20 md:w-[50rem]">
        <div className="h-full rounded-xl bg-cod-gray p-5 divide-y divide-mineshaft">
          <div className="flex flex-col divide-y divide-mineshaft">
            <div>
              <div className="flex w-full h-full justify-between px-4 mb-2 bg-umbra rounded-lg py-2">
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                  1400 Traders
                </span>
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                  Your Rank #43
                </span>
                <div className="flex space-x-4">
                  <div
                    className={cx(
                      'rounded-md',
                      sort === SORT_OPTIONS[0] &&
                        'border border-mineshaft bg-mineshaft'
                    )}
                  >
                    <EqualizerIcon
                      className="text-[1.8rem]"
                      role="button"
                      onClick={() => setSort(SORT_OPTIONS[0])}
                    />
                  </div>
                  <div
                    className={cx(
                      'rounded-md',
                      sort === SORT_OPTIONS[1] &&
                        'border border-mineshaft bg-mineshaft'
                    )}
                  >
                    <AttachMoneyIcon
                      className="text-[1.8rem]"
                      role="button"
                      onClick={() => setSort(SORT_OPTIONS[1])}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>Rank</span>
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>Trader</span>
                <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>Profit</span>
              </div>
            </div>
            <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
              <span
                className={cx(
                  RESPONSIVE_TITLE_TEXT_STYLE,
                  'text-center bg-gradient-to-r from-wave-blue to-blue-300 text-transparent bg-clip-text'
                )}
              >
                1
              </span>
              <span
                className={cx(
                  RESPONSIVE_TITLE_TEXT_STYLE,
                  'text-center bg-gradient-to-r from-wave-blue to-blue-300 text-transparent bg-clip-text'
                )}
              >
                highest-highest-highest
              </span>
              <span
                className={cx(
                  RESPONSIVE_TITLE_TEXT_STYLE,
                  'text-center bg-gradient-to-r from-wave-blue to-blue-300 text-transparent bg-clip-text'
                )}
              >
                200k
              </span>
            </div>
            <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
              <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>2</span>
              <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>
                second-highest-second
              </span>
              <span className={cx(RESPONSIVE_TITLE_TEXT_STYLE)}>300k</span>
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
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <p className={cx(RESPONSIVE_TITLE_TEXT_STYLE, 'font-light')}>
            Join the trading competition of upto $30k prize pool!
          </p>
        </div>
        <div className="flex flex-row space-x-4 w-full items-center justify-center px-10">
          <CustomButton
            className={cx(RESPONSIVE_TITLE_TEXT_STYLE, 'flex-1 bg-primary p-1')}
          >
            <span>Trade</span>
          </CustomButton>
          <CustomButton
            className={cx(RESPONSIVE_TITLE_TEXT_STYLE, 'flex-1 bg-primary p-1')}
          >
            <span>Learn More</span>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
