import SwapPanel from './SwapPanel';

const CurveSwap = () => {
  return (
    <div className="py-12 mt-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
      <div className="py-12 my-auto flex justify-center">
        <div className="flex flex-col bg-cod-gray p-3 rounded-xl">
          <span className="text-base pb-3">Swap</span>
          <SwapPanel />
        </div>
      </div>
    </div>
  );
};

export default CurveSwap;
