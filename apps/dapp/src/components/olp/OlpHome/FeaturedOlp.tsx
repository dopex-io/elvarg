import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import { BigNumber } from 'ethers';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

import Typography from 'components/UI/Typography';
import { NumberDisplay } from 'components/UI';

import { getReadableTime } from 'utils/contracts';

import { DOPEX_API_BASE_URL } from 'constants/env';
import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import { IOlpApi } from 'pages/olp';

// TODO: remove
const fakeData = [4000, 3000, 2000, 2780, 3490];

const CustomizedTooltip = ({ active, payload }: any) => {
  return active && payload && payload.length ? (
    <Box className="flex flex-col items-center border-transparent">
      <Typography variant="h5" className="-mt-1">
        {payload[0].payload.utilization}
      </Typography>
    </Box>
  ) : null;
};

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
              src={CHAIN_ID_TO_NETWORK_DATA[olp.chainId]?.icon}
              alt={CHAIN_ID_TO_NETWORK_DATA[olp.chainId]?.name}
              className="w-6 h-auto"
            />
          </Box>
        </Box>
        <ResponsiveContainer width="99%" height="35%" className="my-3">
          {/* TODO: use utilizationData */}
          <LineChart data={fakeData.map((d) => ({ utilization: d }))}>
            {/* TODO: use utilizationData */}
            <Tooltip
              cursor={false}
              wrapperStyle={{ outline: 'none' }}
              content={<CustomizedTooltip payload={fakeData} />}
            />
            <Line
              className="blur-sm"
              type="monotone"
              dataKey="utilization"
              stroke="#22E1FF"
              dot={false}
            />
          </LineChart>
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
