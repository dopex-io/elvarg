import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import {
  SSOV_MAP,
  OLPS_GROUPS,
  MONTHLY,
  WEEKLY,
  THREE_DAYS,
} from 'constants/index';
import formatAmount from 'utils/general/formatAmount';

interface Props {
  className: string;
  underlying: string;
  data: {
    underlyingSymbol: string;
    symbol: string;
    version: string;
    chainId: number;
    totalVaultDeposits: string;
    currentEpoch: number;
    duration: string;
  }[];
}

function durationToSymbol(duration: string) {
  if (duration === MONTHLY) {
    return 'MONTHLY';
  } else if (duration === WEEKLY) {
    return 'WEEKLY';
  } else if (duration === THREE_DAYS) {
    return 'STRADDLES';
  }
  return '';
}

const StyledWrapper = styled(Box)`
  ${(props: { symbol: string }) => {
    if (props.symbol === 'SSOV')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #7818c4 100%)';
    else if (props.symbol === 'Straddles')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #0400ff 99.1%)';
    return '';
  }};
`;

function VaultCard(props: Props) {
  const { underlying, data } = props;

  const vaultsTvl: { [id: string]: BigNumber } = {};

  OLPS_GROUPS.map((duration) => {
    vaultsTvl[duration] = BigNumber.from('0');
  });

  data.map((c) => {
    let duration: string = '';
    const val = BigNumber.from(c.totalVaultDeposits.split('.')[0]);
    if (c.duration === 'monthly' || c.duration === 'special') {
      duration = MONTHLY;
    } else if (c.duration === 'weekly') {
      duration = WEEKLY;
    } else if (c.symbol.includes('STRADDLE')) {
      duration = THREE_DAYS;
    }
    vaultsTvl[duration] = vaultsTvl[duration]!.add(val);
  });

  const vaults = Object.keys(vaultsTvl).map((duration) => {
    const tvl = vaultsTvl[duration]!;
    return (
      <Box key={duration} className="flex flex-row">
        <Box className="flex flex-grow items-center justify-between">
          {tvl.gt(0) && (
            <Link
              href={`/olp/${underlying}-${durationToSymbol(duration)}`}
              passHref
            >
              {duration}
            </Link>
          )}
          {tvl.eq(0) && duration}
        </Box>
        <Typography variant="h4" className="mr-2">
          {tvl.gt(0) &&
            `${formatAmount(vaultsTvl[duration]!.toString(), 0, true)}`}
          {tvl.eq(0) && '-'}
        </Typography>
      </Box>
    );
  });

  return (
    <StyledWrapper symbol={underlying} className="p-[1px] rounded-xl w-[350px]">
      <Box className="flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto">
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 h-8 max-w-14 flex flex-row"></Box>
            <Box className="flex flex-grow items-center justify-between">
              <Typography variant="h4" className="mr-2 font-bold">
                {underlying}
              </Typography>
              <img
                className="w-9 h-9"
                alt={underlying}
                src={SSOV_MAP[underlying]?.imageSrc}
              />
            </Box>
          </Box>
          {vaults}
          <CustomButton size="medium" className="my-4" fullWidth>
            Manage
          </CustomButton>
        </Box>
      </Box>
    </StyledWrapper>
  );
}

export default VaultCard;
