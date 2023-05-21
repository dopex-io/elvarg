import { useCallback } from 'react';

import { AbiType } from 'abitype';

// import { useContractRead } from 'wagmi';

interface Props<T> {
  address: string;
  abi: T;
  strike: bigint | number;
  expiry: bigint | bigint;
}

const useFetchStrikeData = <T extends AbiType>(props: Props<T>) => {
  const { address, abi, strike, expiry } = props;

  // const contract = useContractRead({
  //   address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1' as any,
  //   abi: [abi],
  // });

  const getStrikeData = useCallback(() => {}, []);

  return;
};

export default useFetchStrikeData;
