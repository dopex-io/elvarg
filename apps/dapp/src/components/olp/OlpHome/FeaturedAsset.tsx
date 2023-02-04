import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import { NumberDisplay } from 'components/UI';

import { getReadableTime } from 'utils/contracts';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import { IOlpApi } from 'pages/olp';

export const FeaturedAsset = ({ olp }: { olp: IOlpApi | undefined }) => {
  if (olp === undefined) return null;

  const splitSymbol = olp.symbol.split('-');

  return (
    <Box className="border border-cod-gray hover:border-wave-blue rounded-lg flex-1 p-1 bg-cod-gray">
      <Box className="flex flex-row p-2">
        <Box className="w-7 h-7 border border-gray-500 rounded-full mr-2">
          <img
            src={`/images/tokens/${olp.underlyingSymbol.toLowerCase()}.svg`}
            alt={olp.underlyingSymbol}
          />
        </Box>
        <Typography variant="h6" color="white" className="capitalize my-auto">
          {`${splitSymbol[0]} ${splitSymbol[1]?.toLowerCase()}`}
        </Typography>
        <Box className="ml-auto">
          <img
            src={CHAIN_ID_TO_NETWORK_DATA[olp.chainId]?.icon}
            alt={CHAIN_ID_TO_NETWORK_DATA[olp.chainId]?.name}
            className="w-6 h-6 "
          />
        </Box>
      </Box>

      <Box className="flex flex-row justify-between bg-black rounded-b-lg p-1 mt-1">
        <Box className=" flex flex-col flex-1 items-center">
          <Typography variant="h6" color="white">
            $
            <NumberDisplay n={BigNumber.from(olp.tvl)} decimals={0} />
          </Typography>
          <Typography variant="h6" color="stieglitz">
            TVL
          </Typography>
        </Box>
        <Box className=" flex flex-col flex-1 items-center">
          <Typography variant="h6" color="white">
            $
            <NumberDisplay n={BigNumber.from(olp.utilization)} decimals={0} />
          </Typography>
          <Typography variant="h6" color="stieglitz">
            Utilization
          </Typography>
        </Box>
        <Box className=" flex flex-col flex-1 items-center">
          <Typography variant="h6" className="w-max">
            {getReadableTime(olp.expiry)}
          </Typography>
          <Typography variant="h6" color="stieglitz">
            Expiry
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
