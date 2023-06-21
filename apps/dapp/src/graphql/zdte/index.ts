import { graphql } from 'gql/zdte';

export const getZdteSpreadTradesFromTimestampDocument = graphql(`
  query getZdteSpreadTradesFromTimestamp($fromTimestamp: BigInt!) {
    trades(where: { timestamp_gt: $fromTimestamp }, first: 1000) {
      id
      amount
    }
  }
`);
