import formatAmount from 'utils/general/formatAmount';

interface Props {
  tokenSymbol: string;
  inputAmount: string | number;
  label?: string;
  rounded?: boolean;
}

const InputRow = (props: Props) => {
  const { tokenSymbol, inputAmount, rounded = false } = props;

  return (
    <div className="flex justify-end space-x-3 divide-x-2 divide-cod-gray">
      <p className="text-sm my-auto">{formatAmount(inputAmount, 3)}</p>
      <div
        className={`flex justify-center bg-mineshaft w-1/4 px-2 py-1 my-auto ${
          rounded ? 'rounded-br-xl' : null
        }`}
      >
        <p className="text-sm my-1">{tokenSymbol}</p>
      </div>
    </div>
  );
};

export default InputRow;
