import Link from 'next/link';
import Box from '@mui/material/Box';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  data: {
    underlyingSymbol: string;
    symbol: string;
    duration: string;
    tvl: number;
    chainId: number;
  };
}

function VaultCard(props: Props) {
  const { data } = props;

  return (
    <Box className="p-4 rounded-xl w-[350px] bg-umbra space-y-5">
      <Box className="flex items-center justify-between">
        <Typography variant="h4" className="font-bold capitalize">
          {data.underlyingSymbol} {data.duration}
        </Typography>
        <img
          className="w-9 h-9"
          alt={data.underlyingSymbol}
          src={`/images/tokens/${data.underlyingSymbol.toLowerCase()}.svg`}
        />
      </Box>
      <Box className="flex items-center justify-between">
        <Typography variant="h5">TVL</Typography>
        <Typography variant="h4">
          {data.tvl > 0 && `$${formatAmount(data.tvl.toString(), 0, true)}`}
          {data.tvl === 0 && '-'}
        </Typography>
      </Box>
      <Link href={`/olp/${data.symbol}`} passHref>
        <CustomButton size="medium" className="my-4" fullWidth>
          Manage
        </CustomButton>
      </Link>
    </Box>
  );
}

export default VaultCard;
