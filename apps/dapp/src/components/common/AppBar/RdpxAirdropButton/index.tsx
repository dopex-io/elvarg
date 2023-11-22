import { useCallback } from 'react';
import { utils as ethersUtils } from 'ethers';

import { Addresses, MerkleDistributor__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { useQuery } from '@tanstack/react-query';
import { useNetwork, useSwitchNetwork, useWalletClient } from 'wagmi';
import { getContract } from 'wagmi/actions';

import { formatAmount } from 'utils/general';

import { DOPEX_API_BASE_URL } from 'constants/env';

const RdpxAirdropButton = ({ account }: { account: string }) => {
  const walletClient = useWalletClient();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const query = useQuery({
    queryKey: ['rdpxAirdrop', account],
    queryFn: () =>
      fetch(`${DOPEX_API_BASE_URL}/v2/quest/rdpxAirdrop/${account}`).then(
        (res) => res.json()
      ),
  });

  const handleClick = useCallback(async () => {
    if (!walletClient.data) return;

    if (network.chain?.id !== 1) {
      switchNetwork?.(1);
    }

    const contract = getContract({
      address: Addresses[1]['MerkleDistributor'],
      abi: MerkleDistributor__factory.abi,
      ...(walletClient.data ? { walletClient: walletClient.data } : {}),
    });

    const txData = query?.data?.data;

    await contract?.write.claim([
      txData.index,
      txData.address,
      txData.amount,
      txData.proof,
    ]);
  }, [network, query, switchNetwork, walletClient]);

  if (!query.isLoading && query?.data?.valid) {
    return (
      <Button
        color="carbon"
        className="flex space-x-2 mx-2 bg-gradient-to-r from-blue-700 to-purple-700"
        onClick={handleClick}
      >
        Claim {formatAmount(ethersUtils.formatEther(query.data.data.amount), 0)}{' '}
        <img className="ml-2 w-5" src="/images/tokens/rdpx.svg" alt="rDPX" />
      </Button>
    );
  } else return null;
};

export default RdpxAirdropButton;
