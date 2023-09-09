import { graphql } from 'gql/clamm';

export const getTickerLiquiditiesDocument = graphql(`
  query getTickerLiquidities($first: Int!, $skip: Int) {
    tickerLiquidities(first: $first, skip: $skip) {
      poolAddress
      tickLower
      tickUpper
      liquidity
      liquidityUsed
      liquidityUnused
      liquidityCompounded
      liquidityWithdrawn
      totalEarningsWithdrawn
      totalShares
      totalCallAssetsEarned
      totalPutAssetsEarned
    }
  }
`);

export const getTickerLiquidityDocument = graphql(`
  query getTickerLiquidity($tickLower: Int!, $tickUpper: Int!) {
    tickerLiquidities(where: { tickLower: $tickLower, tickUpper: $tickUpper }) {
      poolAddress
      tickLower
      tickUpper
      liquidity
      liquidityUsed
      liquidityUnused
      liquidityCompounded
      liquidityWithdrawn
      totalEarningsWithdrawn
      totalShares
      totalCallAssetsEarned
      totalPutAssetsEarned
    }
  }
`);

export const getOptionsPositionsForUserDocument = graphql(`
  query getOptionsPositionsForUser(
    $user: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    optionsPositions(
      first: $first
      skip: $skip
      where: { user: $user, poolAddress: $poolAddress }
    ) {
      user
      poolAddress
      tickUpper
      tickLower
      options
      exercised
      premium
      expiry
      isPut
    }
  }
`);

export const getWritePositionsForUserDocument = graphql(`
  query getWritePositionsForUser(
    $user: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    writePositions(
      first: $first
      skip: $skip
      where: { user: $user, poolAddress: $poolAddress }
    ) {
      poolAddress
      liquidity
      shares
      tickUpper
      tickLower
      user
      earned
    }
  }
`);
