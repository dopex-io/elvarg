interface Props {
  label: string;
  data: readonly [string, string][];
}

const CustomCell = ({ label, data }: Props) => {
  return (
    <div className="flex flex-col flex-grow p-3 text-xs justify-between">
      <div className="flex space-x-1">
        {data.map((d, i) => (
          <div key={i} className="text-stieglitz mb-1">
            <span className="text-white">{d[0]}</span> {d[1]}
          </div>
        ))}
      </div>
      <span className="text-stieglitz">{label}</span>
    </div>
  );
};

export default CustomCell;
