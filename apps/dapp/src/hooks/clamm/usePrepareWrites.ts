import { OptionPools__factory, PositionsManager__factory } from '@dopex-io/sdk';
import { Address, usePrepareContractWrite } from 'wagmi';

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

export type ExerciseOptionRollParams = {
  optionPool: Address;
  parameters: {
    pool: Address;
    tickLower: number;
    tickUpper: number;
    expiry: bigint;
    callOrPut: boolean;
    amountToExercise: bigint;
  };
};

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
    address: '0x090fdA0F2c26198058530A0A8cFE53362d54d9f1',
    functionName: isPut ? 'mintPutOptionRoll' : 'mintCallOptionRoll',
    args: [parameters],
  });
  return config;
};

// export const usePrepareExerciseOptionRoll = ({
//   optionPool,
//   parameters,
// }: ExerciseOptionRollParams) => {
//   const { config } = usePrepareContractWrite({
//     abi: OptionPools__factory.abi,
//     address: '0x090fdA0F2c26198058530A0A8cFE53362d54d9f1',
//     functionName: 'exerciseOptionRoll',
//     args: [
//       {
//         pool: '0xce0F8EfCa1Bc21Dd9AaEE6ee8F2c0F2155980bBB',
//         tickLower: 277500,
//         tickUpper: 277510,
//         expiry: 0n,
//         callOrPut: true,
//         amountToExercise: 0n,
//       },
//     ],
//   });
//   return config;
// };

// export const usePrepareBurnOPosition = (parameters: BurnPositionParams) => {
//   const { config } = usePrepareContractWrite({
//     abi: PositionsManager__factory.abi,
//     address: '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F',
//     functionName: 'burnPosition',
//     args: [parameters],
//   });
//   return config;
// };
