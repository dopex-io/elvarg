import Typography2 from 'components/UI/Typography2';

interface Props {
  label?: string;
  data: readonly [string | React.ReactNode, string][];
}

const CustomCell = ({ label, data }: Props) => {
  return (
    <div className="flex flex-col flex-grow p-3 justify-between space-y-2 w-full">
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
        <Typography2 variant="caption" color="stieglitz">
          {label}
        </Typography2>
      ) : null}
    </div>
  );
};

export default CustomCell;
