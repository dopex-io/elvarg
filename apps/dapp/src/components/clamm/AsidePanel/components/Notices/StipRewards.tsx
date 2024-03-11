import { arbitrum } from 'viem/chains';

import { useNetwork } from 'wagmi';

const StipRewards = () => {
  const { chain } = useNetwork();

  if (!chain || chain.id !== arbitrum.id) return null;

  return (
    <div className="flex flex-col bg-umbra rounded-md space-y-2 p-3">
      <span className="flex w-full justify-between">
        <h6 className="flex items-center justify-center space-x-[4px] text-xs">
          <img src="/images/tokens/arb.svg" alt="ARB" className="h-[14px]" />
          <span>ARB STIP rewards</span>
        </h6>
      </span>
      <p className="text-stieglitz text-xs">
        <b className="text-up-only">600,000 ARB</b> in STIP rewards are
        allocated for strikes in range of <b className="text-white ">+/-2.5%</b>{' '}
        from spot price across all option markets.
      </p>
    </div>
  );
};

export default StipRewards;
