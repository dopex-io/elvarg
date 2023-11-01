import { Input } from '@dopex-io/ui';

import Typography2 from 'components/UI/Typography2';

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
    <div className="bg-umbra rounded-xl w-full h-fit">
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
              className="w-9 h-9 border border-mineshaft rounded-full"
            />
          </div>
        }
        bottomElement={null}
      />
      <Typography2
        variant="caption"
        className="flex justify-between px-3 pb-3"
        color="stieglitz"
      >
        {label}
        <div>
          <Typography2 variant="caption">
            {formatBigint(maxAmount, DECIMALS_TOKEN)}
          </Typography2>{' '}
          {symbol}
        </div>
      </Typography2>
    </div>
  );
};

export default PanelInput;
