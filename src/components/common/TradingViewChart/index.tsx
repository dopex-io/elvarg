import { useMemo, useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import { AdvancedChart } from 'react-tradingview-embed';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./SingleChart.tsx'), {
  ssr: false,
});

const TradingViewChart = () => {
  return <Chart />;
};

export default TradingViewChart;
