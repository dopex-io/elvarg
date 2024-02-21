import formatAmount from 'utils/general/formatAmount';

interface Props {
  stat: {
    symbol: string;
    value: string;
  };
  label: string;
  suffix?: boolean;
}

const Stat = (props: Props) => {
  const { stat, label, suffix = false } = props;

  return (
    <div className="flex flex-col">
      <h6
        className={`flex text-[11px] sm:text-sm md:text-md font-medium text-white items-center space-x-2`}
      >
        <span className="text-stieglitz">{stat.symbol}</span>
        <span>{formatAmount(stat.value ?? 0, 3)}</span>
      </h6>
      <h6 className="text-[11px] sm:text-sm md:text-md font-medium text-stieglitz">
        {label}
      </h6>
    </div>
  );
};

export default Stat;
