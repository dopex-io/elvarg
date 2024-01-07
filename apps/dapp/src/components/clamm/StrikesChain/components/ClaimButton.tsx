import { checksumAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { useAccount, useNetwork } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';
import useMerklRewards from 'hooks/clamm/useMerklRewards';

import { TOKENS } from 'constants/tokens';

const ClaimButton = () => {
  const { chain } = useNetwork();
  const { address: user } = useAccount();

  const { selectedOptionsPool } = useClammStore();

  const { claim, claimed, claimable, refetch } = useMerklRewards({
    user,
    chainId: chain?.id || 42161,
    rewardToken: TOKENS[chain?.id || 42161].find(
      (token) => token.symbol.toUpperCase() === 'ARB',
    ),
    pool: checksumAddress(selectedOptionsPool?.primePool || '0x'),
  });

  return (
    <div className="flex space-x-2">
      {claimed[1] !== 0 ? (
        <p className="text-stieglitz text-xs my-auto">
          Last claimed {formatDistanceToNow(Number(claimed[1]) * 1000)} ago
        </p>
      ) : null}
      <div className="flex rounded-md border border-orange-200 bg-gradient-to-r from-[#fdceaa] via-[#b9aafd] to-[#76a0fc]">
        <Button
          className="bg-transparent disabled:cursor-not-allowed"
          size="xsmall"
          onClick={() =>
            claim()
              .then(() => console.log('claimed'))
              .catch((e) => console.error(e))
              .finally(() => refetch())
          }
          disabled={claimable}
        >
          <span className="flex space-x-2">
            <p className="text-black place-items-start">Claim Rewards</p>
            <SparklesIcon className="fill-current text-[#FDCEAA] h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ClaimButton;
