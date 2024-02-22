import { BaseError, encodeAbiParameters, encodeFunctionData } from 'viem';



import { Button } from '@dopex-io/ui';
import DopexV2OptionMarket from 'abis/clamm/DopexV2OptionMarketV2';
import toast from 'react-hot-toast';
import { useContractWrite } from 'wagmi';



import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammStore from 'hooks/clamm/useClammStore';



import { OptionsPositionsResponse } from 'utils/clamm/varrock/types';



import { UNISWAP_V3_SWAPPER } from 'constants/clamm';





type Props = {
  positions: Map<number, OptionsPositionsResponse>;
  deselectAll: () => void;
};

const MultiExerciseButton = ({ positions, deselectAll }: Props) => {
  const { selectedOptionsPool } = useClammStore();
  const { updateBuyPositions } = useClammPositions();

  const { writeAsync, isLoading } = useContractWrite({
    abi: DopexV2OptionMarket,
    address: selectedOptionsPool?.optionsPoolAddress,
    functionName: 'multicall',
    args: [
      Array.from(positions).map(([_, position]) => {
        return encodeFunctionData({
          abi: DopexV2OptionMarket,
          functionName: 'exerciseOption',
          args: [
            {
              optionId: BigInt(position.meta.tokenId),
              swapper: position.meta.liquiditiesUsed.map(
                () => UNISWAP_V3_SWAPPER,
              ),
              swapData: position.meta.liquiditiesUsed.map(() =>
                encodeAbiParameters(
                  [
                    {
                      name: 'fee',
                      type: 'uint24',
                    },
                    {
                      name: 'minAmountOut',
                      type: 'uint256',
                    },
                  ],
                  [500, 0n],
                ),
              ),
              liquidityToExercise: position.meta.liquiditiesUsed.map((l) =>
                BigInt(l),
              ),
            },
          ],
        });
      }),
    ],
  });

  return (
    <Button
      className="text-xs"
      size="xsmall"
      disabled={positions.size < 2 || isLoading}
      onClick={() => {
        writeAsync()
          .then(() => {
            toast.success('Transaction sent');
            deselectAll();
          })
          .catch((e) => {
            const err = e as BaseError;
            toast.error(err.shortMessage);
          })
          .finally(() => {
            updateBuyPositions?.();
          });
      }}
    >
      Exercise All
    </Button>
  );
};

export default MultiExerciseButton;