import { formatUnits, parseUnits } from 'viem';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  tokenSymbol: string;
  amounts: readonly [bigint, bigint];
  setAmounts: React.Dispatch<React.SetStateAction<readonly [bigint, bigint]>>;
  setBonds: React.Dispatch<React.SetStateAction<string>>;
  index: number;
  label?: string;
  rounded?: boolean;
  disabled?: boolean;
  bondComposition: readonly [bigint, bigint];
}

const InputRow = (props: Props) => {
  const {
    tokenSymbol,
    amounts,
    index,
    rounded = false,
    disabled = false,
  } = props;

  return (
    <div className="border-[0.05px] flex justify-end space-x-3 divide-x-2 divide-cod-gray border-mineshaft rounded-md w-full">
      <div
        className={`flex justify-start w-fit px-2 py-1 my-auto text-stieglitz ${
          rounded ? 'rounded-br-xl' : null
        }`}
      >
        <p className="text-sm my-1">{tokenSymbol}</p>
      </div>
      <input
        type="number"
        className={`text-sm my-auto bg-umbra border-none outline-none text-end w-full pr-3 ${
          disabled ? 'text-mineshaft cursor-not-allowed' : null
        }`}
        value={formatUnits(amounts[index], DECIMALS_TOKEN)}
        disabled={true}
      />
    </div>
  );
};

export default InputRow;
