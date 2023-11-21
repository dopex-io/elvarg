import { Button, Skeleton } from '@dopex-io/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { DOPEX_API_BASE_URL } from 'constants/env';

interface TradeRowProps {
  token: string;
  tradeURL: string;
}

const TradeRow = ({ token, tradeURL }: TradeRowProps) => {
  const query = useQuery({
    queryKey: ['api_price', token],
    queryFn: () => axios.get(`${DOPEX_API_BASE_URL}/v2/price/${token}`),
  });

  if (query.isLoading || !query.data) {
    return <Skeleton width={450} color="umbra" />;
  }

  if (query.isError) {
    return <></>;
  }

  const change24hSign = Number(query.data.data.change24h) > 0 ? '+' : '-';

  return (
    <div className="grid grid-cols-4 items-center">
      <span className="flex space-x-2 items-center">
        <img
          src={`/images/tokens/${token}.svg`}
          alt={`${token}-token-image`}
          className="w-8 h-auto"
        />
        <span className="uppercase">{token}</span>
      </span>
      <span>${query.data.data.cgPrice}</span>
      <span
        className={change24hSign === '-' ? 'text-down-bad' : 'text-up-only'}
      >
        {change24hSign}
        {Math.abs(Number(query.data.data.change24h)).toFixed(2)}%
      </span>
      <Button
        variant="outlined"
        onClick={() => {
          window.open(tradeURL, '_blank');
        }}
      >
        Trade
      </Button>
    </div>
  );
};

export default TradeRow;
