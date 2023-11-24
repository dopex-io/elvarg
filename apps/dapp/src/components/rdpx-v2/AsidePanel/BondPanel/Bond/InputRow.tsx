import { formatUnits, parseUnits } from 'viem';

import Typography2 from 'components/UI/Typography2';

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
  const { tokenSymbol, amounts, index } = props;

  return (
    <div className="flex justify-end border space-x-3 border-mineshaft rounded-md w-full">
      <div className="flex justify-start w-fit p-2 my-auto text-stieglitz">
        <Typography2 variant="caption" color="stieglitz">
          {tokenSymbol}
        </Typography2>
      </div>
      <input
        type="number"
        className="text-sm my-auto bg-umbra outline-none text-end w-full pr-2"
        value={formatUnits(amounts[index], DECIMALS_TOKEN)}
        disabled={true}
      />
    </div>
  );
};

export default InputRow;
