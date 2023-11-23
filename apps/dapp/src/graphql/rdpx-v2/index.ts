import { graphql } from 'gql/rdpx-v2';

// ============================== Delegation Controller V1.1 ==============================
export const getUserDelegatesV2Document = graphql(`
  query getV2UserDelegates($sender: Bytes) {
    v2Delegates(where: { user_contains: $sender }) {
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

export const getDelegatesV2Document = graphql(`
  query getV2Delegates {
    v2Delegates {
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

export const getDelegateV2Bonds = graphql(`
  query UserV2DelegateBonds($sender: Bytes) {
    v2DelegatePositions: v2DelegateBonds(where: { user: $sender }) {
      id
      wethRequired
      amount
      user
      transaction {
        id
        sender
        timestamp
      }
    }

    v2DelegateePositions: v2DelegateeBonds(
      where: { transaction_: { sender: $sender } }
    ) {
      id
      rdpxRequired
      amount
      transaction {
        id
        sender
        timestamp
      }
    }
  }
`);

// ============================== Delegation Controller V1 ==============================
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

export const getDelegateBonds = graphql(`
  query UserDelegateBonds($sender: Bytes) {
    delegatePositions: delegateBonds(where: { user: $sender }) {
      id
      wethRequired
      amount
      transaction {
        id
        sender
        timestamp
      }
    }

    delegateePositions: delegateeBonds(
      where: { transaction_: { sender: $sender } }
    ) {
      id
      rdpxRequired
      amount
      transaction {
        id
        sender
        timestamp
      }
    }
  }
`);

// RDPX V2 Core bonds
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

// ============================== Perpetual vaults ==============================
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

// ============================== Token supplies ==============================
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
