import { BaseError } from 'viem';

import { Button } from '@dopex-io/ui';
import DopexV2OptionMarket from 'abis/clamm/DopexV2OptionMarketV2';
import toast from 'react-hot-toast';
import { useContractWrite } from 'wagmi';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';

import { OptionExerciseData } from '../..';

type Props = {
  positions: Map<string, OptionExerciseData>;
  clearPositions: () => void
};

const MultiExerciseButton = ({ positions, clearPositions }: Props) => {
  const { selectedOptionsMarket } = useClammStore();
  const { updateBuyPositions } = useClammPositions();

  const { writeAsync, isLoading } = useContractWrite({
    abi: DopexV2OptionMarket,
    address: selectedOptionsMarket?.address,
    functionName: 'multicall',
    args: [Array.from(positions).map(([_, { tx }]) => tx.data)],
  });

  return (
    <Button
      className="text-xs"
      size="xsmall"
      disabled={positions.size === 0 || isLoading}
      onClick={() => {
        writeAsync()
          .then(() => {
            toast.success('Transaction sent');
            clearPositions()
          })
          .catch((e) => {
            const err = e as BaseError;
            toast.error(err.shortMessage);
            console.error(err);
          })
          .finally(() => {
            updateBuyPositions?.();
          });
      }}
    >
      Exercise {positions.size > 0 ? `(${positions.size})` : ''}
    </Button>
  );
};

export default MultiExerciseButton;
