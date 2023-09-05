import { OptionPools__factory, PositionsManager__factory } from '@dopex-io/sdk';
import { Address, usePrepareContractWrite } from 'wagmi';

import { ARB_USDC_UNISWAP_POOL_ADDRESS } from 'constants/clamm/markets';

import { PositionManagerParams } from './usePositionManager';

export type UsePrepareMintPositionProps = {
  parameters: PositionManagerParams;
};

export type UsePrepareMintCallOrPutOptionProps = {
  parameters: {
    pool: Address;
    tickLower: number;
    tickUpper: number;
    liquidityToUse: bigint;
    ttl: bigint;
  };
  isPut: boolean;
  optionPool: Address;
};

// export type ExerciseOptionRollParams = {
//   optionPool?: Address;
//   parameters?: {
//     pool?: Address;
//     tickLower?: number;
//     tickUpper?: number;
//     expiry?: bigint;
//     callOrPut?: boolean;
//     amountToExercise?: bigint;
//   };
// };

export type BurnPositionParams = {
  pool: Address;
  tickLower: number;
  tickUpper: number;
  shares: bigint;
};

export const usePrepareMintPosition = ({
  parameters,
}: UsePrepareMintPositionProps) => {
  const { config } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F',
    functionName: 'mintPosition',
    args: [parameters],
  });
  return config;
};

export const usePrepareMintCallOrPutOptionRoll = ({
  optionPool,
  parameters,
  isPut,
}: UsePrepareMintCallOrPutOptionProps) => {
  const { config } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: ARB_USDC_UNISWAP_POOL_ADDRESS,
    functionName: isPut ? 'mintPutOptionRoll' : 'mintCallOptionRoll',
    args: [parameters],
  });
  return config;
};

// @todo, add params and param types
export const usePrepareExerciseOptionRoll = () => {
  const { config } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: ARB_USDC_UNISWAP_POOL_ADDRESS,
    functionName: 'exerciseOptionRoll',
    args: [
      {
        pool: '0xce0F8EfCa1Bc21Dd9AaEE6ee8F2c0F2155980bBB',
        // tickLower: 277460,
        tickLower: 277500,
        // tickUpper: 277470,
        tickUpper: 277510,
        // expiry: 1693839878n,
        expiry: 1693839891n,
        callOrPut: false,
        // amountToExercise: 1889196001030426n,
        amountToExercise: 1884477852069099n,
      },
    ],
  });
  return config;
};

// @todo, add params and param types
export const usePrepareBurnMintPosition = () => {
  const { config } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F',
    functionName: 'burnPosition',
    args: [
      {
        pool: '0xce0F8EfCa1Bc21Dd9AaEE6ee8F2c0F2155980bBB',
        tickLower: 277500,
        tickUpper: 277510,
        // @todo -1
        shares: 2121753551762724917415985909n,
      },
    ],
  });
  return config;
};
