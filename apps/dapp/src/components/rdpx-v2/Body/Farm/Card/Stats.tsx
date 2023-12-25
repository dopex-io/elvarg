import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/UI/Tooltip';
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
      {stats.map((stat, index) =>
        stat.label.includes('*') ? (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger className="cursor-text">
                <div className="flex flex-col p-2 bg-umbra w-full rounded-md text-left">
                  <Typography2 variant="caption">
                    {stat.value} {stat.unit}
                  </Typography2>
                  <Typography2 variant="caption" color="stieglitz">
                    {stat.label}
                  </Typography2>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-umbra w-auto backdrop-blur-md">
                <p className="text-white text-sm">
                  Upto {stat.value}% APR with max multiplier.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
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
        ),
      )}
    </div>
  );
};

export default Stats;
