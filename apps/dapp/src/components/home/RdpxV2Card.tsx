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

const RdpxV2Card = () => {
  return (
    <ProductCard>
      <div className="flex w-full justify-between">
        <img src={`/images/tokens/rdpx.svg`} alt="rdpx-token-image" />
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">rDPX V2</div>
          <div className="text-sm text-stieglitz">
            Bond rDPX & ETH to earn yield
          </div>
        </div>
        <div className="text-sm">
          up to <span className="text-up-only text-xl font-bold">38% APY</span>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-4 items-center">
          <span>rtETH</span>
          <div className="w-20 h-8">
            <Sparkline data={fakeData} />
          </div>
          <span className="text-sm">
            <span className="text-up-only text-base">37.9%</span> APY
          </span>
          <Button
            variant="outlined"
            className="!text-wave-blue border-wave-blue"
          >
            Bond
          </Button>
        </div>
        <div className="grid grid-cols-4 items-center">
          <span>ESV</span>
          <div className="w-20 h-8">
            <Sparkline data={fakeData} />
          </div>
          <span className="text-sm">
            <span className="text-up-only text-base">32.1%</span> APY
          </span>
          <Button
            variant="outlined"
            className="!text-wave-blue border-wave-blue"
          >
            Deposit
          </Button>
        </div>
      </div>
    </ProductCard>
  );
};

export default RdpxV2Card;
