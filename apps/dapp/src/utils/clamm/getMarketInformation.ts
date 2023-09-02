import { ClammPair } from 'store/Vault/clamm';

import { ClammMarket, MARKETS } from '../../constants/clamm/markets';

function getMarketInformation(pair: ClammPair): ClammMarket {
  return MARKETS[pair];
}

export default getMarketInformation;
