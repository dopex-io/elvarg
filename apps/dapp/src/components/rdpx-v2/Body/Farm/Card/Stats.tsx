import Typography2 from 'components/UI/Typography2';

interface Props {
  stats: {
    label: string;
    value: string;
    unit: string | null;
  }[];
}

const Stats = (props: Props) => {
  const { stats } = props;

  return (
    <div className="grid grid-cols-3 grid-flow-row gap-1 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col p-2 bg-umbra w-full rounded-md"
        >
          <Typography2 variant="caption">
            {stat.value} {stat.unit}
          </Typography2>
          <Typography2 variant="caption" color="stieglitz">
            {stat.label}
          </Typography2>
        </div>
      ))}
    </div>
  );
};

export default Stats;
