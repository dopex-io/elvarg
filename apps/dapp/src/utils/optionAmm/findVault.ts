import { MARKETS } from 'constants/optionAmm/markets';

const findVault = (marketName: string) => {
  const market = MARKETS[marketName.split('-')[0]].vaults.find(
    (vault) => vault.symbol === marketName,
  );

  if (!market) return;

  return market;
};

export default findVault;
