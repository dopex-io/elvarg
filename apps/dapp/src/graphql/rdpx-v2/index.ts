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

export const getHistoricBondsDocument = graphql(`
  query HistoricData {
    bonds {
      id
      receiptTokenAmount
      rdpxRequired
      wethRequired
      transaction {
        sender
        timestamp
        hash
      }
    }
    redeemBonds {
      id
      bondId
      receiptTokenAmount
      to
      transaction {
        sender
        timestamp
        hash
      }
    }
  }
`);

export const getHistoricRedeemRequestsDocument = graphql(`
  query UserRedeemRequestsHistory($sender: Bytes!) {
    redeemRequests(where: { sender_contains: $sender }) {
      id
      amount
      ethAmount
      rdpxAmount
      sender
      epoch
    }
  }
`);

export const getDelegateBonds = graphql(`
  query UserDelegateBonds($sender: Bytes) {
    bonds(
      where: {
        and: [
          { transaction_: { sender: $sender } }
          { or: [{ rdpxRequired_lte: 0 }, { wethRequired_lte: 0 }] }
        ]
      }
    ) {
      id
      wethRequired
      rdpxRequired
      receiptTokenAmount
      transaction {
        id
        sender
        timestamp
      }
    }
  }
`);
