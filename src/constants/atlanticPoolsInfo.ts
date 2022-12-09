interface IAtlanticPoolsInfo {
  [key: string]: {
    title: string;
    description: string;
  };
}

export const AP_STRATEGIES: Record<string | symbol, string>[] = [
  {
    title: 'Insured Long Perps',
    symbol: 'INSURED-PERPS',
    path: '/atlantics/manage/insured-perps/',
  },
];

export const ATLANTIC_POOL_INFO: IAtlanticPoolsInfo = {
  CALLS: {
    title: 'ETH CALLS',
    description:
      'Deposit underlying into to vault to write OTM calls 33%+ OTM from spot price on bootstrap to earn premiums and fundings.',
  },
  PUTS: {
    title: 'ETH PUTS',
    description:
      'Deposit into max strikes to write options to write puts of a particular strike as well as strikes below and OTM to earn premium, fundings and underlying on unwinds of options',
  },
};
