import formatAmount from 'utils/general/formatAmount';

interface Props {
  tokenSymbol: string;
  inputAmount: string | number;
  label: string;
}

const InputRow = (props: Props) => {
  const { tokenSymbol, inputAmount, label } = props;

  return (
    <div className="mt-3">
      <div className="flex justify-between space-x-3">
        <p className="text-xs text-stieglitz p-1 w-1/4 my-auto bg-carbon rounded-[0.2rem] text-center">
          {tokenSymbol}
        </p>
        <div className="flex justify-between bg-mineshaft w-1/2 rounded-md px-2">
          <p className="text-sm my-1">{formatAmount(inputAmount, 3)}</p>
          <p className="text-sm text-stieglitz my-1 text-right">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default InputRow;
