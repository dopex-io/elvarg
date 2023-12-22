import React from 'react';
import { getAddress } from 'viem';

import { Dialog } from '@dopex-io/ui';
import { useNetwork } from 'wagmi';

import useClammPositions from 'hooks/clamm/useClammPositions';
import useClammTransactionsStore from 'hooks/clamm/useClammTransactionsStore';
import useReactiveLPPositions from 'hooks/clamm/useWithdraw';

import { getTokenSymbol } from 'utils/token';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import WithdrawPositions from './components/WithdrawPositions';

type Props = {
  handleClose: any;
  isOpen: boolean;
};
const WithdrawSummary = ({ handleClose, isOpen }: Props) => {
  const { chain } = useNetwork();
  const { lpPositions } = useClammPositions();
  const { deposits } = useClammTransactionsStore();
  const { positionsWithdrawable } = useReactiveLPPositions({
    positions: lpPositions.map(
      ({
        token0Address,
        token0Decimals,
        token1Address,
        token1Decimals,
        strikePrice,
        meta: { handler, tickLower, tickUpper, pool, strikeId, shares },
      }) => ({
        handler: getAddress(handler),
        tickLower: tickLower,
        tickUpper: tickUpper,
        pool: getAddress(pool),
        strikeId: BigInt(strikeId),
        shares: BigInt(shares),
        strike: strikePrice,
        token0: {
          symbol: getTokenSymbol({
            address: token0Address,
            chainId: chain?.id ?? DEFAULT_CHAIN_ID,
          }),
          decimals: token0Decimals,
        },
        token1: {
          symbol: getTokenSymbol({
            address: token1Address,
            chainId: chain?.id ?? DEFAULT_CHAIN_ID,
          }),
          decimals: token1Decimals,
        },
      }),
    ),
  });

  return (
    <Dialog
      handleClose={handleClose}
      isOpen={isOpen}
      title="Multi withdraw"
      showCloseIcon
    >
      <WithdrawPositions positions={positionsWithdrawable} />
    </Dialog>
  );
};

export default WithdrawSummary;
