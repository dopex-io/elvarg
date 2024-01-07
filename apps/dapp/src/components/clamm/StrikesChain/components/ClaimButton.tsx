import { checksumAddress, formatUnits, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useMerklRewards from 'hooks/clamm/useMerklRewards';

import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';
import { TOKENS } from 'constants/tokens';

const ClaimButton = () => {
  const { chain } = useNetwork();
  const { address: user } = useAccount();

  const { selectedOptionsPool } = useClammStore();

  const { claim, claiming, claimable, refetch, claimableAmount, tokenSymbol } =
    useMerklRewards({
      user,
      chainId: chain?.id || 42161,
      rewardToken: TOKENS[chain?.id || 42161].find(
        (token) => token.symbol.toUpperCase() === 'ARB',
      ),
      pool: checksumAddress(selectedOptionsPool?.primePool || '0x'),
    });

  return (
    <div className="flex space-x-2">
      <span className="flex space-x-1 text-xs text-stieglitz my-auto">
        <p>Rewards accrued: </p>
        <p
          className={`${
            claimableAmount !== 0n ? 'text-up-only' : 'text-white'
          }`}
        >
          {claimableAmount < parseUnits('1', 15)
            ? '<0.001'
            : formatAmount(formatUnits(claimableAmount, DECIMALS_TOKEN), 3)}
        </p>
        <p>{tokenSymbol}</p>
      </span>
      <div className="flex rounded-md bg-gradient-to-r from-[#fdceaa] to-[#faf1e7]">
        <Button
          className="bg-transparent disabled:cursor-not-allowed"
          size="xsmall"
          onClick={() =>
            claim()
              .then(() => console.log('claimed'))
              .catch((e) => console.error(e))
              .finally(() => refetch())
          }
          disabled={claimable || claiming}
        >
          <span className="flex space-x-2">
            <p className="text-black place-items-start text-xs">
              {claiming ? 'Claiming...' : 'Claim'}
            </p>
            <SparklesIcon className="fill-current text-[#FDA000] h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ClaimButton;
