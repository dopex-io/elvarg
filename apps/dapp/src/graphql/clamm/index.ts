import { graphql } from 'gql/clamm';

export const getUserClammPositions = graphql(`
  query getClammPositions($user: ID!) {
    users(where: { id: $user }) {
      userBuyPositions(where: { exercised: false }) {
        id
        isPut
        options
        premium
        tickLower
        tickUpper
        poolAddress
        expiry
      }
      userWritePositions(where: { burnt: false }) {
        id
        poolAddress
        size
        tickLower
        tickUpper
      }
    }
  }
`);
