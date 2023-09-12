import { Address } from 'viem';

import { OptionAmmPortfolioManager__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

const getPortfolio = async ({
  portfolioManager,
  accountAddress,
}: {
  portfolioManager: Address;
  accountAddress: Address;
}) => {
  const data = await readContract({
    abi: OptionAmmPortfolioManager__factory.abi,
    address: portfolioManager,
    functionName: 'portfolios',
    args: [accountAddress],
  });
  return data;
};

export default getPortfolio;

// @todo: amend implementation in hook
