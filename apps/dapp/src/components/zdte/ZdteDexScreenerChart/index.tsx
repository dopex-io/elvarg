import DexScreenerChart from 'components/common/DexScreenerChart';

interface Props {
  poolName: string;
}

const ZdteDexScreenerChart = (props: Props) => {
  const { poolName } = props;
  return (
    <DexScreenerChart
      poolAddress={
        poolName.toLowerCase() === 'eth'
          ? '0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'
          : '0xcDa53B1F66614552F834cEeF361A8D12a0B8DaD8'
      }
    />
  );
};

export default ZdteDexScreenerChart;
