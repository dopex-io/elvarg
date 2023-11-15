import getToken, { TokenGetterArgs } from './getToken';

const getTokenDecimals = ({ chainId, address }: TokenGetterArgs) => {
  return getToken({ chainId, address }).decimals;
};

export default getTokenDecimals;
