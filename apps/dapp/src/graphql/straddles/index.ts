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
