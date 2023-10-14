import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

// import formatAmount from 'utils/general/formatAmount';

interface Props {
  tokenSymbol: string;
  amounts: number[];
  setAmounts: React.Dispatch<React.SetStateAction<number[]>>;
  setBonds: React.Dispatch<React.SetStateAction<number | string>>;
  index: number;
  label?: string;
  rounded?: boolean;
  disabled?: boolean;
}

const InputRow = (props: Props) => {
  const {
    tokenSymbol,
    amounts,
    setAmounts,
    setBonds,
    index,
    rounded = false,
    disabled = false,
  } = props;

  const { treasuryData } = useBoundStore();

  const handleChange = (e: any) => {
    if (!treasuryData) return;

    let [rdpxRequired, wethRequired] = treasuryData.bondCostPerDsc;

    if (index === 0) {
      const ratio =
        Number(e.target.value) / getUserReadableAmount(rdpxRequired, 18);
      const weth = ratio * getUserReadableAmount(wethRequired, 18);
      const bonds = ratio;
      setAmounts([e.target.value ?? 0, weth]);
      setBonds(bonds);
    } else {
      const ratio =
        Number(e.target.value) / getUserReadableAmount(wethRequired, 18);
      const rdpx = ratio * getUserReadableAmount(rdpxRequired, 18);
      const bonds = ratio;
      setAmounts([rdpx, e.target.value ?? 0]);
      setBonds(bonds);
    }
  };

  return (
    <div className="!border-[0.05px] flex justify-end space-x-3 divide-x-2 divide-cod-gray border-mineshaft rounded-md">
      <div
        className={`flex justify-center w-1/2 px-2 py-1 my-auto text-stieglitz ${
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
        value={amounts[index]}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
      />
    </div>
  );
};

export default InputRow;
