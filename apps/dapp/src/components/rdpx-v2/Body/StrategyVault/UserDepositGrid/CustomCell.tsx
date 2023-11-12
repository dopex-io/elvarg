import { InfoTooltip } from 'components/UI';
import Typography2 from 'components/UI/Typography2';

interface Props {
  label?: string;
  data: readonly [string | React.ReactNode, string][];
  tooltipInfo?: string;
}

const CustomCell = ({ label, data, tooltipInfo }: Props) => {
  return (
    <div className="flex flex-col w-1/2 p-3 justify-between space-y-2">
      <div className="flex space-x-1 w-fit">
        {data.map((d, i) => (
          <div key={i} className="flex space-x-1 w-full">
            <Typography2 variant="caption">{d[0]}</Typography2>
            {d[1] ? (
              <Typography2 variant="caption" color="stieglitz">
                {d[1]}
              </Typography2>
            ) : null}
          </div>
        ))}
      </div>
      {label ? (
        <div className="flex space-x-1">
          <Typography2 variant="caption" color="stieglitz">
            {label}
          </Typography2>
          {tooltipInfo ? (
            <InfoTooltip title={tooltipInfo} className="h-3 w-3 my-auto" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CustomCell;
