import { graphql } from 'gql/optionScalps';

export const getTradeStatsDocument = graphql(`
  query getTraderStats {
    traderStats(first: 1000) {
      id
      totalVolume
      totalPnL
    }
  }
`);

export const getTradesFromTimestampDocument = graphql(`
  query getTradesFromTimestamp($fromTimestamp: BigInt!) {
    trades(where: { timestamp_gt: $fromTimestamp }, first: 1000) {
      id
      size
    }
  }
`);
