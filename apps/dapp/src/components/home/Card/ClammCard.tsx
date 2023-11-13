import { Button } from '@dopex-io/ui';

import Sparkline from '../Sparkline';
import CardHero from './CardHero';
import ProductCard from './ProductCard';

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

const ClammCard = () => {
  return (
    <ProductCard>
      <CardHero
        name="Dopex V2 CLAMM"
        description="Trade options using UNI V3"
        apy={182}
      />
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-4 items-center">
          <span className="flex space-x-2 items-center">
            <img
              src="/images/tokens/btc.svg"
              alt="btc-token-image"
              className="w-8 h-8"
            />
            <span>BTC</span>
          </span>
          <span>$28010</span>
          <span className="text-up-only">+5.9%</span>
          <Button
            variant="outlined"
            className="!text-wave-blue border-wave-blue z-100"
          >
            Trade
          </Button>
        </div>
        <div className="grid grid-cols-4 items-center">
          <span className="flex space-x-2 items-center">
            <img
              src={`/images/tokens/eth.svg`}
              alt="arb-token-image"
              className="w-8 h-9"
            />
            <span>ETH</span>
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

export default ClammCard;
