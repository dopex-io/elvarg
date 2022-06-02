// import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

// import Typography from 'components/UI/Typography';

const ClientRenderedLineChart = dynamic(() => import('./LiquidityLineChart'), {
  ssr: false,
});

const ClientRenderedBarGraph = dynamic(() => import('./LiquidityBarGraph'), {
  ssr: false,
});

interface ChartsProps {
  bar_data: any[];
  line_data: any[];
  underlying: string;
  collateral: string;
  strategy: string;
}

const Charts = (props: ChartsProps) => {
  const { bar_data, line_data, underlying, collateral, strategy } = props;
  // const deposits = useMemo(() => {
  //   return line_chart_data.reduce((acc, curr) => acc + curr.Deposits, 0);
  // }, []);
  // const unlocks = useMemo(() => {
  //   return line_chart_data.reduce((acc, curr) => acc + curr.Unlocks, 0);
  // }, []);

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-2/3 sm:w-full">
        <ClientRenderedBarGraph
          data={bar_data}
          width={750}
          height={175}
          header={{ underlying, collateral, strategy }}
        />
      </Box>
      <Box className="flex flex-col bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-full md:w-1/3 sm:w-full">
        <ClientRenderedLineChart data={line_data} width={340} height={150} />
      </Box>
    </Box>
  );
};

export default Charts;
