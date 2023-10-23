import formatAmount from 'utils/general/formatAmount';

interface Props {
  label: string;
  value: number | string | undefined;
}

const GridItem = (props: Props) => {
  const { label, value } = props;

  return (
    <div className="flex flex-col space-y-2 w-1/2 p-2 divide-carbon">
      <p className="text-xs text-stieglitz">{label}</p>
      <p className="text-sm">
        {typeof value === 'number' ? formatAmount(value, 3, false) : value}
      </p>
    </div>
  );
};

export default GridItem;
