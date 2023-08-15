import { collateralTokenSymbol } from '../..';

type PremiumSectionProps = {
  premium: string;
};

const PremiumSection = (props: PremiumSectionProps) => {
  return (
    <div className="w-full h-full flex flex-col border border-umbra px-2 py-1 rounded-md">
      <div className="w-full flex flex-row items-center justify-between space-y-2">
        <span className="text-stieglitz text-sm">Side</span>
        <span className="text-sm">Call + Put</span>
      </div>
      <div className="w-full flex flex-row items-center justify-between">
        <span className="text-stieglitz text-sm">Premium</span>
        <span className="text-sm">
          {props.premium}
          <span className="ml-1 text-sm text-stieglitz">
            {collateralTokenSymbol}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PremiumSection;
