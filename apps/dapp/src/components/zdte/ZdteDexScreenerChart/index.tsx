import { useBoundStore } from 'store';

import DexScreenerChart from 'components/common/DexScreenerChart';

const ZdteDexScreenerChart = () => {
  const { staticZdteData } = useBoundStore();
  return <DexScreenerChart poolAddress={staticZdteData?.baseTokenAddress!} />;
};

export default ZdteDexScreenerChart;
