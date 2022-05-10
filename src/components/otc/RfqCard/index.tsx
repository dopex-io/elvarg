import { useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import CustomMenu from 'components/otc/CustomMenu';
import RfqCardItem from 'components/otc/RfqCardItem';

import formatAmount from 'utils/general/formatAmount';
import smartTrim from 'utils/general/smartTrim';

interface RfqCardProps {
  symbol: string;
  id: string;
  data: {
    isBuy: boolean;
    dealer: string;
    dealerAddress: string;
    quote: string;
    base: string;
    price: string;
    amount: string;
    timestamp: any;
    isFulfilled: boolean;
  };
}

const RfqCard = (props: RfqCardProps) => {
  const { symbol, data, id } = props;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(data.dealerAddress);
  }, [data]);

  return (
    <Box className="flex flex-col col-span-1 p-2 bg-cod-gray rounded-xl border border-mineshaft space-y-2 px-4 py-4">
      <Box className="flex justify-between">
        <Box className="flex space-x-2 w-2/3">
          <img
            src={`/assets/${symbol.toLowerCase()}.svg`}
            alt={symbol.toUpperCase()}
            className="w-[2em] h-[2em]"
          />
          <Typography variant="h6" className="text-white my-auto">
            {data.base}
          </Typography>
        </Box>
        <Box className="flex">
          <Typography
            variant="h6"
            className={`font-bold text-${
              data.isBuy ? 'primary' : 'down-bad'
            } self-center ${
              data.isBuy ? 'bg-primary' : 'bg-down-bad'
            } bg-opacity-50 px-2 py-1 rounded-md border border-${
              data.isBuy ? 'primary' : 'down-bad'
            }`}
          >
            {data.isBuy ? 'BUY' : 'SELL'}
          </Typography>
          <CustomMenu data={data} id={id} actions={['View RFQ', 'Close RFQ']} />
        </Box>
      </Box>
      <RfqCardItem
        info="Position Size"
        value={Number(data.amount) + ' ' + data.base}
      />
      <RfqCardItem info="Status" value={data.isFulfilled ? 'Closed' : 'Open'} />
      <RfqCardItem
        info="Bid"
        value={data.isBuy ? formatAmount(data.price, 3, true) : '-'}
      />
      <RfqCardItem
        info="Ask"
        value={!data.isBuy ? formatAmount(data.price, 3, true) : '-'}
      />
      <RfqCardItem
        info="Expiry"
        value={format(
          new Date(Number(data.timestamp.seconds + 604800) * 1000),
          'H:mm d LLL'
        )}
      />
      <RfqCardItem
        info="Dealer"
        value={
          <Box className="flex flex-row">
            <IconButton onClick={handleCopy} className="p-0">
              <ContentCopyIcon className="fill-current text-stieglitz p-1" />
            </IconButton>
            <Typography variant="h6" className="text-white">
              {smartTrim(data.dealerAddress, 12)}
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};

export default RfqCard;
