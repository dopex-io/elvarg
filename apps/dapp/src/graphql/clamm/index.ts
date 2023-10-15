import { graphql } from 'gql/clamm';

export const getStrikeDataDocument = graphql(`
  query getStrikeDatas($poolAddress: String!, $first: Int!, $skip: Int) {
    strikeDatas(first: $first, skip: $skip, where: { pool: $poolAddress }) {
      pool
      tickLower
      tickUpper
      totalLiquidity
      usedLiquidity
      totalShares
    }
  }
`);

export const getOptionsPositionsForUserDocument = graphql(`
  query getOptionsPositionsForUser(
    $userAddress: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    optionsPositions(
      first: $first
      skip: $skip
      where: { user: $userAddress, pool: $poolAddress }
    ) {
      user
      pool
      isPut
      tickLower
      tickUpper
      options
      expiry
      premium
      count
    }
  }
`);

export const getOptionsPositionPurchasesForUserDocument = graphql(`
  query getOptionsPositionPurchasesForUser(
    $userAddress: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    optionsPositionPurchases(
      first: $first
      skip: $skip
      where: { user: $userAddress, pool: $poolAddress }
    ) {
      user
      pool
      tickLower
      tickUpper
      options
      premium
      expiry
      isPut
      blockNumber
      timestamp
      count
      txHash
    }
  }
`);

export const getOptionsPositionExercisesForUserDocument = graphql(`
  query getOptionsPositionExercisesForUser(
    $userAddress: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    optionsPositionExercises(
      first: $first
      skip: $skip
      where: { user: $userAddress, pool: $poolAddress }
    ) {
      user
      pool
      tickLower
      tickUpper
      isPut
      profit
      options
      premium
      expiry
      blockNumber
      timestamp
      count
      txHash
      sqrtx96Price
    }
  }
`);

export const getWritePositionsMintsForUserDocument = graphql(`
  query getWritePositionsMintsForUser(
    $userAddress: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    writePositionMints(
      first: $first
      skip: $skip
      where: { user: $userAddress, pool: $poolAddress }
    ) {
      pool
      tickLower
      tickUpper
      user
      liquidity
      shares
      blockNumber
      sqrtx96Price
      timestamp
      count
      txHash
    }
  }
`);

export const getWritePositionsBurnsForUserDocument = graphql(`
  query getWritePositionsBurnsForUser(
    $userAddress: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    writePositionBurns(
      first: $first
      skip: $skip
      where: { user: $userAddress, pool: $poolAddress }
    ) {
      pool
      tickLower
      tickUpper
      user
      sqrtx96Price
      liquidity
      shares
      blockNumber
      timestamp
      count
      txHash
    }
  }
`);

export const getWritePositionsForUserDocument = graphql(`
  query getWritePositionsForUser(
    $userAddress: String!
    $poolAddress: String!
    $first: Int!
    $skip: Int
  ) {
    writePositions(
      first: $first
      skip: $skip
      where: { user: $userAddress, pool: $poolAddress }
    ) {
      pool
      tickLower
      tickUpper
      user
      liquidity
      shares
      timestamp
      count
    }
  }
`);

export const getEarningsCheckpointsDocument = graphql(`
  query getEarningsCheckpoints(
    $poolAddress: String!
    $timestampGt: BigInt!
    $first: Int!
    $skip: Int
  ) {
    earningsCheckpoints(
      first: $first
      skip: $skip
      where: { timestamp_gt: $timestampGt, pool: $poolAddress }
    ) {
      tickLower
      tickUpper
      liquidity
      timestamp
    }
  }
`);

export const optionsPurchasedQuery = graphql(`
  query optionsPurchased($poolAddress: String!, $first: Int!, $skip: Int) {
    optionsPositionPurchases(
      first: $first
      skip: $skip
      where: { pool: $poolAddress }
    ) {
      tickLower
      tickUpper
      options
      isPut
      sqrtx96Price
    }
  }
`);
