import { useState, useCallback, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';

import Input from 'components/UI/Input';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { formatAmount, smartTrim } from 'utils/general';

import { Delegate, DEFAULT_DELEGATE } from './';

const DelegateRow = ({
  label,
  val,
}: {
  label: string;
  val: string | React.ReactNode;
}) => {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-stieglitz">{label}</span>
      <span className="text-sm">{val}</span>
    </div>
  );
};

interface Props {
  delegate: Delegate;
  setDelegate: Function;
}

const DelegatePanel = (props: Props) => {
  const { delegate, setDelegate } = props;

  const { treasuryContractState, provider } = useBoundStore();

  const [value, setValue] = useState<string>('0');

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) => {
      setValue(e.target.value);
    },
    []
  );

  useEffect(() => {
    (async () => {
      if (!treasuryContractState.contracts || !provider || Number(value) < 0)
        return;

      const treasury = treasuryContractState.contracts.treasury;

      let delegate;

      try {
        delegate = await treasury.getDelegatePosition(value);
      } catch (e) {
        delegate = DEFAULT_DELEGATE;
        console.log(e);
      }

      setDelegate({
        _id: Math.ceil(Number(value)),
        delegate: delegate.delegate || '-',
        fee: getUserReadableAmount(delegate.fee || 0, 8),
        activeCollateral: formatAmount(
          getUserReadableAmount(delegate.activeCollateral || 0, 18),
          3
        ),
        amount: formatAmount(
          getUserReadableAmount(delegate.amount || 0, 18),
          3
        ),
      });
    })();
  }, [provider, setDelegate, treasuryContractState, value]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(delegate.delegate);
  }, [delegate.delegate]);

  return (
    <div>
      <Input
        type="number"
        size="small"
        variant="variant1"
        value={Number(value) >= 0 ? Math.ceil(Number(value)) : ''}
        onChange={handleChange}
        placeholder="Delegate ID"
        className="border border-jaffa rounded-[8px] justify-center"
        leftElement={null}
      />
      <div className="flex flex-col space-y-2 my-2">
        <DelegateRow
          label="Delegate"
          val={
            <Tooltip title="Copy" enterTouchDelay={0} leaveTouchDelay={1000}>
              <div
                onClick={delegate.delegate.length > 0 ? handleCopy : () => {}}
                className="cursor-pointer"
              >
                {smartTrim(delegate.delegate, 10)}{' '}
              </div>
            </Tooltip>
          }
        />
        <DelegateRow label="Amount" val={delegate.amount + ' WETH'} />
        <DelegateRow
          label="Active Collateral"
          val={delegate.activeCollateral + ' WETH'}
        />
        <DelegateRow label="Fee" val={delegate.fee + '%'} />
      </div>
    </div>
  );
};

export default DelegatePanel;
