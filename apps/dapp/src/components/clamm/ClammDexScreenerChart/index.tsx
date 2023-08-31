import DexScreenerChart from 'components/common/DexScreenerChart';

interface Props {
  poolName: string;
}

const assetToContractAddress: Record<string, string> = {
  eth: '0xc31e54c7a869b9fcbecc14363cf510d1c41fa443',
  arb: '0xcDa53B1F66614552F834cEeF361A8D12a0B8DaD8',
};

const ClammDexScreenerChart = (props: Props) => {
  const { poolName } = props;

  return (
    <DexScreenerChart
      poolAddress={assetToContractAddress[poolName.toLowerCase()]!}
    />
  );
};

export default ClammDexScreenerChart;
