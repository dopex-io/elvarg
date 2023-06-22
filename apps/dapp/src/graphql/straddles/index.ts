import { graphql } from 'gql/straddles';

export const getStraddlesUserDataDocument = graphql(`
  query getStraddlesUserData($user: ID!) {
    users(where: { id: $user }) {
      id
      straddlesUserOpenDeposits {
        id
        epoch
        amount
        rollover
      }
      userOpenStraddles {
        id
        epoch
        amount
        strikePrice
        underlyingPurchased
      }
    }
  }
`);

export const getStraddlesUserSettleDataDocument = graphql(`
  query getStraddlesUserSettleData($user: String, $vault: String) {
    settles(
      where: {
        user_contains_nocase: $user
        straddleVault_contains_nocase: $vault
      }
    ) {
      pnl
      id
      transaction {
        id
      }
    }
    straddlePurchases(
      where: {
        user_contains_nocase: $user
        straddleVault_contains_nocase: $vault
      }
    ) {
      cost
      strikePrice
      epoch
      amount
      id
    }
  }
`);
