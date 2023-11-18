import getToken, { TokenGetterArgs } from './getToken';

const getTokenSymbol = ({ chainId, address }: TokenGetterArgs) => {
  return getToken({ chainId, address }).symbol;
};

export default getTokenSymbol;
