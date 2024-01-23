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
      <h6 className="flex flex-row' text-xs sm:text-sm md:text-md font-medium text-white items-center">
        <span
          className={`text-stieglitz ${suffix ? 'order-last pl-1' : 'order-first pr-1'}`}
        >
          {stat.symbol}
        </span>
        <span>{formatAmount(stat.value ?? 0, 2, true)}</span>
      </h6>
      <h6 className="text-xs sm:text-sm md:text-md font-medium text-stieglitz">
        {label}
      </h6>
    </div>
  );
};

export default Stat;
