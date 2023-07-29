import { graphql } from 'gql/ssovs';

export const getSsovPurchasesFromTimestampDocument = graphql(`
  query getSsovPurchasesFromTimestamp($fromTimestamp: BigInt!) {
    ssovoptionPurchases(
      where: { transaction_: { timestamp_gt: $fromTimestamp } }
    ) {
      ssov {
        id
      }
      amount
    }
  }
`);

export const getSsovUserDataDocument = graphql(`
  query getSsovUserData($user: ID!) {
    users(where: { id: $user }) {
      id
      userPositions(first: 1000) {
        id
        epoch
        strike
        amount
      }
      userSSOVDeposit(first: 1000) {
        id
        transaction {
          id
        }
        user {
          id
        }
        sender
        epoch
        strike
        amount
        ssov {
          id
        }
      }
      userSSOVOptionBalance(first: 1000) {
        id
        transaction {
          id
        }
        epoch
        strike
        user {
          id
        }
        sender
        amount
        fee
        premium
        ssov {
          id
        }
      }
    }
  }
`);
