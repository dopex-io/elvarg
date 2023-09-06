import { graphql } from 'gql/clamm';

export const getTickerLiquidities = graphql(`
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

export const getTickerLiquidity = graphql(`
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

export const getOptionsPositionsForUser = graphql(`
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

export const getWritePositionsForUser = graphql(`
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
