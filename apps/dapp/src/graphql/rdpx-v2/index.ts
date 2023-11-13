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

export const getReceiptTokenSupplyDocument = graphql(`
  query getReceiptTokenSupply {
    totalReceiptTokenSupplies {
      id
      amount
      transaction {
        sender
        timestamp
      }
    }
  }
`);

export const getRdpxSuppliesDocument = graphql(`
  query getRdpxSupplies {
    totalRdpxSupplies {
      id
      amount
      transaction {
        timestamp
        sender
      }
    }
  }
`);

export const getUserDelegatesDocument = graphql(`
  query getUserDelegates($sender: Bytes) {
    delegates(where: { user_contains: $sender }) {
      delegateId
      amount
      activeCollateral
      fee
      transaction {
        timestamp
      }
    }
  }
`);

export const getDelegatesDocument = graphql(`
  query getDelegates {
    delegates {
      delegateId
      amount
      activeCollateral
      fee
      transaction {
        timestamp
        sender
      }
    }
  }
`);
