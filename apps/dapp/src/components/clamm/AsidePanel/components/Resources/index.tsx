import React from 'react';

const Resources = () => {
  return (
    <>
      <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
        <span className="flex w-full justify-between">
          <h6 className="flex items-center justify-center space-x-[4px] text-xs">
            <img src="/images/tokens/arb.svg" alt="ARB" className="h-[14px]" />
            <span>ARB STIP rewards</span>
          </h6>
        </span>
        <p className="text-stieglitz text-xs">
          <b className="text-up-only">600,000 ARB</b> in STIP rewards are
          allocated for strikes in range of{' '}
          <b className="text-white ">+/-2.5%</b> from spot price across all
          option markets.
        </p>
      </div>
      <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
        <span className="flex w-full justify-between">
          <h6 className="flex items-center justify-center space-x-[4px] text-xs">
            <img src="/images/tokens/dpx.svg" alt="dpx" className="h-[20px]" />
            <span>Dopex V2 Tutorial</span>
          </h6>
        </span>
        <p className="text-stieglitz text-xs">
          Need help understanding how to use CLAMM to purchase options and
          deposit to earn premiums and swap fees? Check out the{' '}
          <a
            className="text-wave-blue font-semi underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://learn.dopex.io/quick-start/clamm-walkthrough"
          >
            CLAMM: Walkthrough
          </a>
        </p>
      </div>
    </>
  );
};

export default Resources;
