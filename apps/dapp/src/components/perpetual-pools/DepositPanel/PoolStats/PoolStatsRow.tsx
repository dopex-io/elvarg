interface PoolStatsRowProps {
  description: string;
  value: string;
}

const PoolStatsRow = (props: PoolStatsRowProps) => {
  const { description, value } = props;

  return (
    <div className="flex justify-between">
      <p className="text-sm text-stieglitz">{description}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};

export default PoolStatsRow;
