import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const StraddleClosedBanner = () => {
  return (
    <div className="xl:max-w-5xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-md mx-auto mt-32 mb-4 lg:mb-8 bg-yellow-400 rounded-lg p-3 h-full flex items-center space-x-4">
      <div className="text-black">
        <ExclamationTriangleIcon className="h-10 w-auto" />
      </div>
      <div className="text-black text-lg">
        Atlantic Straddle vaults have been closed and are no longer operational,
        please withdraw your assets.
      </div>
    </div>
  );
};

export default StraddleClosedBanner;
