import CardHero from './CardHero';
import ProductCard from './ProductCard';
import TradeRow from './TradeRow';

const ClammCard = () => {
  return (
    <ProductCard>
      <CardHero
        name="Dopex V2 CLAMM"
        description="Trade options using UNI V3"
        apy={182}
      />
      <div className="flex flex-col space-y-4">
        <TradeRow tradeURL="/" token="btc" />
        <TradeRow tradeURL="/" token="eth" />
      </div>
    </ProductCard>
  );
};

export default ClammCard;
