import Link from 'next/link';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';

interface Props {
  underlyingSymbol: string;
  data: {
    underlyingSymbol: string;
    symbol: string;
    duration: string;
    tvl: number;
    chainId: number;
  };
}

const StyledWrapper = styled(Box)`
  ${(props: { symbol: string }) => {
    if (props.symbol === 'ETH-MONTHLY-OLP')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #7818c4 100%)';
    else if (props.symbol === 'RDPX-MONTHLY-OLP')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #0400ff 99.1%)';
    return '';
  }};
`;

function VaultCard(props: Props) {
  const { underlyingSymbol, data } = props;

  const vaults = (
    <Box className="flex flex-row">
      <Box className="flex flex-grow items-center justify-between">
        {data.duration.toUpperCase()}
      </Box>
      <Typography variant="h4" className="mr-2">
        {data.tvl > 0 && `$${formatAmount(data.tvl.toString(), 0, true)}`}
        {data.tvl === 0 && '-'}
      </Typography>
    </Box>
  );

  return (
    <StyledWrapper
      symbol={data.symbol}
      className="p-[1px] rounded-xl w-[350px]"
    >
      <Box className="flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto">
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 h-8 max-w-14 flex flex-row"></Box>
            <Box className="flex flex-grow items-center justify-between">
              <Typography variant="h4" className="-ml-2 font-bold">
                {underlyingSymbol}
              </Typography>
              <img
                className="w-9 h-9"
                alt={underlyingSymbol}
                src={SSOV_MAP[underlyingSymbol]?.imageSrc}
              />
            </Box>
          </Box>
          {vaults}
          <Link href={`/olp/${data.symbol}`} passHref>
            <CustomButton size="medium" className="my-4" fullWidth>
              Manage
            </CustomButton>
          </Link>
        </Box>
      </Box>
    </StyledWrapper>
  );
}

export default VaultCard;
