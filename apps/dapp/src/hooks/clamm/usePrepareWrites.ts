import { PositionsManager__factory } from '@dopex-io/sdk';
import { usePrepareContractWrite } from 'wagmi';

import { PositionManagerParams } from './usePositionManager';

type UsePrepareMintPositionProps = {
  parameters: PositionManagerParams;
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
