import { graphql } from 'gql/rdpx-v2';

export const getUserPurchasesDocument = graphql(`
  query getUserPurchases {
    purchases(first: 10) {
      id
      amount
      strike
      premium
      tokenId
      transaction {
        timestamp
        sender
      }
    }
  }
`);

export const getUserRedeemRequestsDocument = graphql(`
  query Query($sender: Bytes!) {
    redeemRequests(where: { sender_contains: $sender }) {
      sender
      amount
      ethAmount
      rdpxAmount
      epoch
    }
  }
`);
