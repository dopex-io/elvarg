import { useCallback } from 'react';
import { utils as ethersUtils } from 'ethers';
import { Addresses, MerkleDistributor__factory } from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { useQuery } from '@tanstack/react-query';
import { useContract, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { formatAmount } from 'utils/general';

// TODO: Replace with DOPEX_BASE_API_URL
const DOPEX_API_URL =
  'https://dopex-api-git-feat-dopex-quests-dopex-io.vercel.app';

const RdpxAirdropButton = ({ account }: { account: string }) => {
  const { data: signer } = useSigner();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const contract = useContract({
    address: Addresses[1]['MerkleDistributor'],
    abi: MerkleDistributor__factory.abi,
    signerOrProvider: signer,
  });

  const query = useQuery({
    queryKey: ['rdpxAirdrop', account],
    queryFn: () =>
      fetch(`${DOPEX_API_URL}/v2/quest/rdpxAirdrop/${account}`).then((res) =>
        res.json()
      ),
  });

  const handleClick = useCallback(async () => {
    if (!signer) return;

    if (network.chain?.id !== 1) {
      switchNetwork?.(1);
    }

    const txData = query.data.data;

    await contract?.claim(
      txData.index,
      txData.address,
      txData.amount,
      txData.proof
    );
  }, [contract, network.chain?.id, query.data, signer, switchNetwork]);

  if (!query.isLoading && query.data.valid) {
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
