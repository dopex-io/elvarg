// import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

// import Typography from 'components/UI/Typography';

const data = [
  {
    name: '1/05',
    Deposits: 4000,
    Unlocks: 3420,
    amt: 2400,
  },
  {
    name: '8/05',
    Deposits: 3000,
    Unlocks: 2900,
    amt: 2210,
  },
  {
    name: '15/05',
    Deposits: 2000,
    Unlocks: 2000,
    amt: 2290,
  },
  {
    name: '22/05',
    Deposits: 1890,
    Unlocks: 1540,
    amt: 2181,
  },
  {
    name: '28/05',
    Deposits: 2390,
    Unlocks: 2100,
    amt: 2500,
  },
];

const ClientRenderedLineChart = dynamic(() => import('./StatsLineChart'), {
  ssr: false,
});

const Charts = () => {
  // const deposits = useMemo(() => {
  //   return data.reduce((acc, curr) => acc + curr.Deposits, 0);
  // }, []);
  // const unlocks = useMemo(() => {
  //   return data.reduce((acc, curr) => acc + curr.Unlocks, 0);
  // }, []);

  return (
    <Box className="flex flex-shrink space-x-3">
      <Box className="flex flex-col bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-2/3">
        <ClientRenderedLineChart data={data} width={720} height={175} />
      </Box>
      <Box className="flex flex-col bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-1/3">
        <ClientRenderedLineChart data={data} width={340} height={175} />
      </Box>
    </Box>
  );
};

export default Charts;
