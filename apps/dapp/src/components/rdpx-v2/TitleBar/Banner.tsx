import React from 'react';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="flex bg-primary p-3 rounded-lg w-full justify-between mb-6">
      <span className="flex flex-col space-y-2 text-white w-3/4">
        <p className="text-lg">rDPX V2 will be deprecated soon.</p>
        <p className="text-sm text-slate-300">
          {`Please redeem, withdraw and unstake your assets from the Bond, Perpetual Put Vault, Staking & Farm pages. Don't forget to claim any pending rewards.`}
        </p>
      </span>
      <Link
        href="https://blog.dopex.io/articles/transitioning-from-rdpx"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded-md bg-white text-black flex space-x-1 my-auto w-fit"
      >
        Go →
      </Link>
    </div>
  );
};

export default Banner;
