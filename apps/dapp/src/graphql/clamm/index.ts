import { graphql } from 'gql/clamm';

export const getUserClammPositions = graphql(`
  query getClammPositions($user: ID!) {
    users(where: { id: $user }) {
      userBuyPositions {
        id
        isPut
        options
        premium
        tickLower
        tickUpper
        poolAddress
        expiry
      }
      userWritePositions {
        id
        poolAddress
        size
        tickLower
        tickUpper
      }
    }
  }
`);
