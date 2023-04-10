interface PoolStatsBoxInterface {
  stat: string | number;
  description: string;
}

const PoolStatsBox = (props: PoolStatsBoxInterface) => {
  const { stat, description } = props;

  return (
    <div className="w-1/2 p-3">
      <p className="text-sm">{stat}</p>
      <p className="text-sm text-stieglitz">{description}</p>
    </div>
  );
};

export default PoolStatsBox;
