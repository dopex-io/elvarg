import AlertIcon from 'svgs/icons/AlertIcon';

const StrategyVaultBody = () => {
  return (
    <div className="flex flex-col space-y-4 w-full sm:w-full lg:w-3/4 h-full">
      <div className="bg-cod-gray rounded-xl w-full h-fit p-3">
        <div className="bg-umbra rounded-xl p-3">
          <div className="flex">
            <span className="text-sm mb-2 flex">
              <AlertIcon className="my-auto mr-2" /> What is the ETH strategy
              vault
            </span>
          </div>
          <p className="text-xs text-stieglitz text-justify">
            rDPX v2 is a system that allows you to mint DPXETH, a yield-bearing
            synthetic version of ETH.
          </p>
        </div>
        <span className="text-sm mt-4 mb-3 flex">Your deposits</span>
        <div className="bg-umbra rounded-lg grid md:grid-cols-5 grid-cols-2 max-w-full">
          <div className="p-3 flex-2 md:flex-1 border-r border-cod-gray">
            <div className="text-sm text-stieglitz mb-1">
              <span className="text-white">300</span> ESV
            </div>
            <span className="text-sm text-stieglitz">Amount</span>
          </div>
          <div className="p-3 md:flex-1 md:border-r border-b md:border-b-0 border-cod-gray">
            <div className="text-sm text-stieglitz mb-1">
              <span className="text-white">5</span> ETH{' '}
              <span className="text-white">24</span> RDPX
            </div>
            <span className="text-sm text-stieglitz">Composition</span>
          </div>
          <div className="p-3 md:flex-1 border-t border-r md:border-t-0 border-cod-gray">
            <div className="text-sm text-stieglitz mb-1">
              <span className="text-white">21</span> RDPX
            </div>
            <span className="text-sm text-stieglitz">Earnings</span>
          </div>
          <div className="p-3 md:flex-1">
            <div className="text-sm text-stieglitz mb-1">
              <span className="text-white">21</span> ESV
            </div>
            <span className="text-sm text-stieglitz">To be unlocked</span>
          </div>
          <div className="p-3 md:flex-1">
            <div className="text-sm text-stieglitz mb-1">-</div>
            <span className="text-sm text-stieglitz">Withdrawable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyVaultBody;
