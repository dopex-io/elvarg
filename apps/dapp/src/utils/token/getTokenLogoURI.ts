import getToken, { TokenGetterArgs } from './getToken';

const getTokenLogoURI = ({ chainId, address }: TokenGetterArgs) => {
  return getToken({ chainId, address }).logoURI.replace('BASE_URL', '');
};

export default getTokenLogoURI;
