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
        txInput
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

export const getTotalMintSize = graphql(`
  query getTotalMintSize {
    writePositions(where: { burnt: false }) {
      size
    }
  }
`);

export const getTotalPremium = graphql(`
  query getTotalPremium {
    buyPositions(where: { exercised: false }) {
      premium
    }
  }
`);

export const getUsePositions = graphql(`
  query getUsePositions {
    usePositions {
      liquidityToUse
      tickUpper
      tickLower
    }
  }
`);

export const getBuyPositionsWithCallData = graphql(`
  query getBuyPositions {
    buyPositions {
      tickLower
      tickUpper
      txInput
    }
  }
`);
