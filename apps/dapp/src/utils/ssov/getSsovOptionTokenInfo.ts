import { Address } from 'viem';

import { SsovV3OptionToken__factory } from '@dopex-io/sdk';
import { readContracts } from 'wagmi/actions';

const fnNames = ['ssov', 'name', 'strike', 'hasExpired'] as const;
type SsovV3OptionInfoType = {
  [key in (typeof fnNames)[number]]:
    | string
    | number
    | bigint
    | Address
    | boolean
    | undefined;
};

const getSsovOptionTokenInfo = async ({ address }: { address: Address }) => {
  const data = await readContracts({
    contracts: [
      {
        abi: SsovV3OptionToken__factory.abi,
        address,
        functionName: 'ssov',
      },
      {
        abi: SsovV3OptionToken__factory.abi,
        address,
        functionName: 'name',
      },
      {
        abi: SsovV3OptionToken__factory.abi,
        address,
        functionName: 'strike',
      },
      {
        abi: SsovV3OptionToken__factory.abi,
        address,
        functionName: 'hasExpired',
      },
    ],
  });
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    obj = Object.fromEntries(
      data.map((result, index) => [fnNames[index], result.result]),
    );
  }

  return obj as SsovV3OptionInfoType;
};

export default getSsovOptionTokenInfo;
