import { useEffect, useState } from 'react';
import { parseAbi } from 'viem';

import { Address, useContractReads, usePublicClient } from 'wagmi';

export type DepositPosition = {
  epoch: bigint;
  amount: bigint;
  address: Address;
  underlying: string;
  chainId: number;
};

const abi = parseAbi([
  'function writePositionsOfOwner(address owner) view returns(uint256[] tokenIds)',
  'function writePositions(uint256 id) view returns(uint256 epoch, uint256 usdDeposit, bool rollover)',
]);

const CONTRACTS: { address: Address; underlying: string; chainId: number }[] = [
  {
    address: '0xfca313e2be55957AC628a6193A60D38aDC2da64E',
    underlying: 'ETH',
    chainId: 42161,
  },
  {
    address: '0x5847a350a388454a76f34Ceb6eb386Bf652DD0DD',
    underlying: 'rDPX',
    chainId: 42161,
  },
  {
    address: '0x0Dc96f38980144ebFfe745706DFeE92622dba829',
    underlying: 'DPX',
    chainId: 42161,
  },
  {
    address: '0x1a848bc8C28b4ea08C2f1589386C4f988d4e9fcb',
    underlying: 'MATIC',
    chainId: 137,
  },
];

const useAtlanticStraddlePositions = ({ user }: { user: Address }) => {
  const [positions, setPositions] = useState<DepositPosition[]>([]);

  const arbitrumPublicClient = usePublicClient();
  const polygonPublicClient = usePublicClient({ chainId: 137 });

  const { data } = useContractReads({
    contracts: CONTRACTS.map(({ address, chainId }) => {
      return {
        abi,
        address,
        chainId,
        functionName: 'writePositionsOfOwner',
        args: [user],
      };
    }),
  });

  useEffect(() => {
    async function getDepositPositionInfo() {
      if (!data) return;

      const _positions: DepositPosition[] = [];

      for (let i = 0; i < CONTRACTS.length; i++) {
        console.log(data[i].result);
        const positionIds = data[i].result as bigint[];

        const depositPositionInfo = await arbitrumPublicClient.multicall({
          contracts: positionIds.map((id) => {
            return {
              abi,
              address: CONTRACTS[i].address,
              functionName: 'writePositions',
              args: [id],
              chainId: CONTRACTS[i].chainId,
            };
          }),
        });

        console.log('water', depositPositionInfo);

        depositPositionInfo.forEach(({ result }) => {
          _positions.push({
            epoch: result ? result[0] : 0n,
            amount: result ? result[1] : 0n,
            address: CONTRACTS[i].address,
            underlying: CONTRACTS[i].underlying,
            chainId: CONTRACTS[i].chainId,
          });
        });
      }

      setPositions(_positions);
    }

    getDepositPositionInfo();
  }, [arbitrumPublicClient, data, polygonPublicClient]);

  return positions;
};

export default useAtlanticStraddlePositions;
