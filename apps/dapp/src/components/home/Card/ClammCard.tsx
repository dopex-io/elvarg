import CardHero from './CardHero';
import ProductCard from './ProductCard';
import TradeRow from './TradeRow';

const ClammCard = ({ apy }: { apy: number }) => {
  return (
    <ProductCard>
      <CardHero
        name="Dopex V2 CLAMM"
        description="Trade options using UNI V3"
        apy={apy}
      />
      <div className="flex flex-col space-y-4">
        <TradeRow tradeURL="/clamm/WETH-USDC" token="eth" />
        <TradeRow tradeURL="/clamm/WBTC-USDC" token="btc" />
      </div>
    </ProductCard>
  );
};

export default ClammCard;
