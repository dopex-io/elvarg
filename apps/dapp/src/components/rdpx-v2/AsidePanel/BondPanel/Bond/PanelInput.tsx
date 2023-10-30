import { Input } from '@dopex-io/ui';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

interface Props {
  amount: string;
  handleChange: (e: {
    target: { value: React.SetStateAction<string> };
  }) => void;
  maxAmount: bigint;
  iconPath: string;
  symbol: string;
  label: string;
}

const PanelInput = (props: Props) => {
  const { amount, handleChange, maxAmount, iconPath, symbol, label } = props;

  return (
    <Input
      type="number"
      variant="xl"
      value={amount}
      onChange={handleChange}
      placeholder="0.0"
      leftElement={
        <div className="flex my-auto space-x-2 w-2/3">
          <img
            src={iconPath}
            alt="dpxeth"
            className="w-10 h-10 border border-mineshaft rounded-full"
          />
        </div>
      }
      bottomElement={
        <div className="flex justify-between">
          <span className="text-xs text-stieglitz">{label}</span>
          <span className="text-xs">
            {formatBigint(maxAmount, DECIMALS_TOKEN)}
            <span className="text-xs text-stieglitz"> {symbol}</span>
          </span>
        </div>
      }
    />
  );
};

export default PanelInput;
