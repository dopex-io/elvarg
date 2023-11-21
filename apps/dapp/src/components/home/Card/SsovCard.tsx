import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { DOPEX_API_BASE_URL } from 'constants/env';

import CardHero from './CardHero';
import ProductCard from './ProductCard';
import TradeRow from './TradeRow';

const SsovCard = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['ssov'],
    queryFn: () => axios.get(`${DOPEX_API_BASE_URL}/v2/ssov`),
  });

  const apy = useMemo(() => {
    if (isError) {
      return 0;
    } else if (isLoading) {
      return 0;
    } else if (data) {
      const apys = data.data[42161]
        .map((ssov: { apy: string[] }) => {
          return ssov.apy;
        })
        .flat()
        .map((apy: string) => Number(apy));

      const largestApy = apys.reduce(
        (largest: number, current: number) =>
          current > largest ? current : largest,
        apys[0],
      );

      return largestApy;
    }
  }, [data, isError, isLoading]);

  return (
    <ProductCard>
      <CardHero
        name="SSOV"
        description="Sell covered options to earn yield"
        apy={apy}
      />
      <div className="flex flex-col space-y-4">
        <TradeRow tradeURL="/ssov-beta/ARB" token="arb" />
        <TradeRow tradeURL="/ssov-beta/DPX" token="dpx" />
      </div>
    </ProductCard>
  );
};

export default SsovCard;
