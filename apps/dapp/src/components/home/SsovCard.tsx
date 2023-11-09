import { Button } from '@dopex-io/ui';

import ProductCard from './ProductCard';
import Sparkline from './Sparkline';

const fakeData = [
  { price: 1, timestamp: '1/10/2023' },
  { price: 1.2, timestamp: '8/20/2023' },
  { price: 1.1, timestamp: '11/3/2023' },
  { price: 1.12, timestamp: '4/6/2023' },
  { price: 1.23, timestamp: '9/19/2023' },
  { price: 1.19, timestamp: '2/11/2023' },
  { price: 1.12, timestamp: '4/6/2023' },
  { price: 1.15, timestamp: '4/6/2023' },
  { price: 1.2, timestamp: '4/6/2023' },
  { price: 1, timestamp: '1/10/2023' },
  { price: 1.2, timestamp: '8/20/2023' },
  { price: 1.1, timestamp: '11/3/2023' },
  { price: 1.12, timestamp: '4/6/2023' },
  { price: 1.23, timestamp: '9/19/2023' },
  { price: 1.19, timestamp: '2/11/2023' },
  { price: 1.12, timestamp: '4/6/2023' },
  { price: 1.15, timestamp: '4/6/2023' },
  { price: 1.2, timestamp: '4/6/2023' },
];

const SsovCard = () => {
  return (
    <ProductCard>
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">Single Staking Option Vaults</div>
          <div className="text-sm text-stieglitz">
            Sell covered options to earn yield{' '}
          </div>
        </div>
        <div className="text-sm">
          up to <span className="text-up-only text-xl font-bold">76% APY</span>
        </div>
      </div>
      {/* <div className="grid grid-cols-3 items-center">
        <div className="flex flex-col items-center ">
          <span className="text-lg font-bold text-wave-blue">9.45M</span>
          <span className="text-xs">TVL</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-wave-blue">3.1M </span>
          <span className="text-xs">OI</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-wave-blue">103K</span>
          <span className="text-xs">24h Vol</span>
        </div>
      </div> */}
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-4 items-center">
          <span className="flex space-x-2 items-center">
            <img
              src={`/images/tokens/steth.svg`}
              alt="eth-token-image"
              className="w-8 h-8"
            />
            <span>stETH</span>
          </span>
          <span>$1910</span>
          <span className="text-up-only">+5.9%</span>
          <Button
            variant="outlined"
            className="!text-wave-blue border-wave-blue"
          >
            Trade
          </Button>
        </div>
        <div className="grid grid-cols-4 items-center">
          <span className="flex space-x-2 items-center">
            <img
              src={`/images/tokens/arb.svg`}
              alt="arb-token-image"
              className="w-8 h-9"
            />
            <span>ARB</span>
          </span>
          <span>$1.2</span>
          <span className="text-down-bad">-3.1%</span>
          <Button
            variant="outlined"
            className="!text-wave-blue border-wave-blue"
          >
            Trade
          </Button>
        </div>
      </div>
    </ProductCard>
  );
};

export default SsovCard;
