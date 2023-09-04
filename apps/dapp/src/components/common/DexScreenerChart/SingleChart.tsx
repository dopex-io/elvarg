export interface SingleChartProps {
  poolAddress: string;
  className?: string;
}

const SingleChart = (props: SingleChartProps) => {
  return (
    <div id="dexscreener-embed">
      <iframe
        src={`https://dexscreener.com/arbitrum/${props.poolAddress}?embed=1&theme=dark&trades=0&info=0`}
        className={props.className ?? ''}
      />
    </div>
  );
};

export default SingleChart;
