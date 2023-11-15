import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

export interface TokenGetterArgs {
  chainId: number;
  address: string;
}

const getToken = ({ chainId, address }: TokenGetterArgs): Token => {
  const token = TOKENS[chainId].find((token) => {
    if (token.address.toLowerCase() === address.toLowerCase()) return true;
  });

  if (!token)
    return {
      chainId,
      address,
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      logoURI: '',
      decimals: 18,
    };

  return token;
};

export default getToken;
