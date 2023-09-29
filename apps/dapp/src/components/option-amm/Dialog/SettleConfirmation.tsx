import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { OptionAmm__factory } from '@dopex-io/sdk';
import { Button, Dialog } from '@dopex-io/ui';
import { format } from 'date-fns';
import { erc721ABI, useAccount, useContractWrite } from 'wagmi';
import { readContract } from 'wagmi/actions';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import { formatAmount } from 'utils/general';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  open: boolean;
  handleClose: () => void;
  data: {
    tokenId: bigint;
    amount: bigint;
    expiry: bigint;
    pnl?: bigint;
    side: string;
    isShort: boolean;
    title: string;
  };
}

const SettleConfirmation = (props: Props) => {
  const { open, handleClose, data } = props;

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);

  const [approved, setApproved] = useState<boolean>(false);

  const { write: settle } = useContractWrite({
    abi: OptionAmm__factory.abi,
    address: vault.address,
    functionName: data.isShort ? 'coverShortOptionPosition' : 'exercise',
    args: [data.tokenId, data.amount],
  });
  const { write: approve } = useContractWrite({
    abi: erc721ABI,
    address: vault.positionMinter,
    functionName: 'setApprovalForAll',
    args: [vault.address, true],
  });

  const handleClick = useCallback(() => {
    if (!approved) approve?.();
    else settle?.();
  }, [approve, approved, settle]);

  const updateApproval = useCallback(async () => {
    if (!address || vault.address === '0x' || !data) return;

    const isApproved = await readContract({
      abi: erc721ABI,
      address: vault.positionMinter,
      functionName: 'isApprovedForAll',
      args: [address, vault.address],
    });

    setApproved(isApproved);
  }, [address, data, vault.address, vault.positionMinter]);

  useEffect(() => {
    updateApproval();
  }, [updateApproval]);

  const buttonState = useMemo(() => {
    updateApproval();
    const defaultState = {
      handler: handleClick,
    };
    if (!approved)
      return { ...defaultState, disabled: false, textContent: 'Approve' };
    else {
      return {
        disabled: data.pnl === 0n && !data.isShort,
        textContent: data.isShort ? 'Cover' : 'Exercise',
      };
    }
  }, [approved, data.isShort, data.pnl, handleClick, updateApproval]);

  return (
    <Dialog
      isOpen={open}
      handleClose={handleClose}
      title={data.title}
      showCloseIcon
    >
      <div className="flex flex-col space-y-3 mt-2">
        <div className="border border-carbon rounded-lg divide-y divide-carbon">
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Token ID</p>
            <p>{Number(data.tokenId)}</p>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Options</p>
            <p>{formatAmount(formatUnits(data.amount, DECIMALS_TOKEN), 3)}</p>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Expiry</p>
            <p>{format(Number(data.expiry) * 1000, 'dd LLL yyyy')}</p>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Side</p>
            <p>{data.side}</p>
          </div>
          {data.pnl !== undefined && !data.isShort ? (
            <div className="flex justify-between text-xs p-3">
              <p className="text-stieglitz">PnL</p>
              <p
                className={`${
                  data.pnl > 0n ? 'text-up-only' : 'text-down-bad'
                }`}
              >
                ${formatAmount(formatUnits(data.pnl, DECIMALS_STRIKE))}
              </p>
            </div>
          ) : null}
        </div>
        <Button
          onClick={handleClick}
          disabled={buttonState.disabled}
          size="small"
          color={true ? 'mineshaft' : 'carbon'}
          className="font-normal transition ease-in-out duration-200"
        >
          {buttonState.textContent}
        </Button>
      </div>
    </Dialog>
  );
};

export default SettleConfirmation;
