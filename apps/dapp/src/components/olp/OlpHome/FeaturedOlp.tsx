import Link from 'next/link';

import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { IOlpApi } from 'pages/olp';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  // Tooltip,
  YAxis,
} from 'recharts';

import { NumberDisplay } from 'components/UI';
import Typography from 'components/UI/Typography';

import { getReadableTime } from 'utils/contracts';

import { CHAINS } from 'constants/chains';
import { DOPEX_API_BASE_URL } from 'constants/env';

// TODO: remove
const fakeData = [1, 2, 3, 4, 5, 6, 7, 6, 5, 6, 7, 8, 9, 7, 5, 6, 9];

// const CustomizedTooltip = ({ active, payload }: any) => {
//   return active && payload && payload.length ? (
//     <Box className="flex flex-col items-center border-transparent">
//       <Typography variant="h5" className="-mt-1">
//         {payload[0].payload.utilization}
//       </Typography>
//     </Box>
//   ) : null;
// };

export const FeaturedOlp = ({ olp }: { olp: IOlpApi | undefined }) => {
  // TODO: set utilizationData
  const [_, setUtilizationData] = useState([]);

  useEffect(() => {
    if (!olp) {
      return;
    }
    async function getData() {
      await axios
        .get(`${DOPEX_API_BASE_URL}/olp/utilizations?symbol=${olp?.symbol}`)
        .then((payload) => payload.data.utilizations)
        .then((d) => setUtilizationData(d))
        .catch((err) => console.log(err));
    }
    getData();
  }, [olp]);

  if (olp === undefined) return null;

  const splitSymbol = olp.symbol.split('-');

  return (
    <Box className="cursor-pointer border border-cod-gray hover:border-wave-blue rounded-lg flex-1 p-1 bg-cod-gray">
      <Link href={`/olp/${olp.symbol}`} passHref target="_blank">
        <Box className="flex p-2">
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
              src={CHAINS[olp.chainId]?.icon}
              alt={CHAINS[olp.chainId]?.name}
              className="w-6 h-auto"
            />
          </Box>
        </Box>
        <ResponsiveContainer width="99%" height="35%" className="my-3">
          {/* TODO: use utilizationData */}
          <AreaChart data={fakeData.map((d) => ({ utilization: d }))}>
            {/* TODO: use utilizationData */}
            {/* <Tooltip
              cursor={false}
              wrapperStyle={{ outline: 'none' }}
              content={<CustomizedTooltip payload={fakeData} />}
            /> */}
            <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0.5%" stopColor="#002eff" stopOpacity={0.8} />
                <stop offset="99.5%" stopColor="#22e1ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              className="blur-[2px]"
              type="monotone"
              dataKey="utilization"
              stroke="#22e1ff"
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <Divider className="fill-current bg-carbon" />
        <Box className="flex justify-between rounded-b-lg p-1 mt-1">
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
            <Typography variant="h6" color="wave-blue">
              {olp.tvl === 0
                ? '0'
                : Math.round((olp.utilization / olp.tvl) * 100)}
              %
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
      </Link>
    </Box>
  );
};
