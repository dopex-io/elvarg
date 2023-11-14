import formatAmount from 'utils/general/formatAmount';

interface Props {
  stat: {
    symbol: string;
    value: string;
  };
  label: string;
}

const Stat = (props: Props) => {
  const { stat, label } = props;

  return (
    <div className="flex flex-col">
      <h6 className="flex text-xs sm:text-sm md:text-md font-medium text-white items-center space-x-1">
        <span className="text-stieglitz">{stat.symbol}</span>
        <span>{formatAmount(stat.value ?? 0, 5)}</span>
      </h6>
      <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
        {label}
      </h6>
    </div>
  );
};

export default Stat;
