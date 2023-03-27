import cx from 'classnames';
import AppBar from 'components/common/AppBar';
import Head from 'next/head';
import React, { useState } from 'react';

const TOKENS = ['ARB', 'ETH'];
const RESPONSE_TITLE_TEXT_STYLE = 'text-sm md:text-md lg:text-lg';

const LeaderBoard = () => {
  const [selectedToken, setSelectedToken] = useState('ARB');
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
            RESPONSE_TITLE_TEXT_STYLE,
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
                RESPONSE_TITLE_TEXT_STYLE,
                'mx-4 mt-4 flex flex-col-reverse font-lighter underline-offset-2',
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
      {/* Leaderboard table */}
      <div className="h-fit-content w-screen px-20 md:w-[50rem]">
        <div className="h-full rounded-lg bg-cod-gray p-5 divide-y divide-mineshaft">
          {/* content */}
          <div className="flex flex-col divide-y divide-mineshaft">
            <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
              <span className="text-center">Rank</span>
              <span>Trader</span>
              <span>Profit</span>
            </div>
            <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
              <span className="text-center bg-gradient-to-r from-wave-blue to-blue-300 text-transparent bg-clip-text">
                1
              </span>
              <span className="text-center bg-gradient-to-r from-wave-blue to-blue-300 text-transparent bg-clip-text">
                highest-highest-highest
              </span>
              <span className="text-center bg-gradient-to-r from-wave-blue to-blue-300 text-transparent bg-clip-text">
                200k
              </span>
            </div>
            <div className="flex flex-row justify-between px-4 py-3 md:px-14 md:py-5">
              <span className="text-center">1</span>
              <span>second-highest-second</span>
              <span>300k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
