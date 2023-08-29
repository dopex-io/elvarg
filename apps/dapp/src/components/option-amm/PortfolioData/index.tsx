import { columnLabels } from 'constants/optionAmm/placeholders';

const dataPlaceholders: React.ReactNode[] = [
  <p className="text-up-only text-xs" key="1">
    10
  </p>,
  <p className="text-xs" key="2">
    10,102 USDC
  </p>,
  <p className="text-xs" key="3">
    10,102 USDC
  </p>,
];

const InfoColumn = ({
  label,
  data,
}: {
  label: string;
  data: React.ReactNode | string;
}) => (
  <div className="flex flex-col md:flex-row-reverse space-x-0 md:space-x-1 text-left">
    {data}
    <p className="text-stieglitz text-xs pr-0 md:pr-1">{label}</p>
  </div>
);

const PortfolioInfo = () => {
  return (
    <div className="flex flex-grow md:flex-grow-0 justify-around space-x-2 h-fit bg-cod-gray rounded-md p-2 self-end">
      {columnLabels.map((col, _idx) => (
        <InfoColumn key={_idx} label={col} data={dataPlaceholders[_idx]} />
      ))}
    </div>
  );
};

export default PortfolioInfo;
