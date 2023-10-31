import { Input } from '@dopex-io/ui';

type InputProps = {
  inputAmount: string;
  handleInputAmountChange: (e: any) => void;
  handleMax: (e: any) => void;
  selectedTokenSymbol: string;
  optionsAvailable: string;
  depositBalance: string;
  isTrade: boolean;
};

const ClammInput = ({
  inputAmount,
  handleInputAmountChange,
  handleMax,
  selectedTokenSymbol,
  optionsAvailable,
  depositBalance,
  isTrade,
}: InputProps) => {
  return (
    <Input
      variant="xl"
      type="string"
      value={inputAmount}
      onChange={handleInputAmountChange}
      leftElement={
        <img
          src={`/images/tokens/${String(
            selectedTokenSymbol,
          ).toLowerCase()}.svg`}
          alt={selectedTokenSymbol.toLowerCase()}
          className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
        />
      }
      bottomElement={
        <div
          className="flex justify-between text-xs text-stieglitz"
          role="button"
          onClick={handleMax}
        >
          <p>{isTrade ? 'Options Available' : 'Deposit amount'}</p>
          <span className="flex">
            <img
              src="/assets/max.svg"
              className="hover:bg-silver rounded-[4px]"
              alt="max"
            />

            <p className="text-white px-1">
              {isTrade ? optionsAvailable : depositBalance}
            </p>
            {selectedTokenSymbol}
          </span>
        </div>
      }
      placeholder="0.0"
    />
  );
};

export default ClammInput;
