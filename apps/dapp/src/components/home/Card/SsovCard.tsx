import { Button } from '@dopex-io/ui';

import CardHero from './CardHero';
import ProductCard from './ProductCard';

const SsovCard = () => {
  return (
    <ProductCard>
      <CardHero
        name="SSOV"
        description="Sell covered options to earn yield"
        apy={76}
      />
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
