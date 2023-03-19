import { CHAINS } from 'constants/chains';

const isNativeToken = (token: string) => {
  let nativeTokens: string[] = Object.keys(CHAINS).reduce<string[]>(
    (acc, chainId) => {
      const nativeToken = CHAINS[Number(chainId)]?.nativeToken;

      return nativeToken ? [...acc, nativeToken] : acc;
    },
    []
  );

  return nativeTokens.includes(token);
};

export default isNativeToken;
