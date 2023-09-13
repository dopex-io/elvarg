import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

import {
  OptionAmm__factory,
  OptionAmmPortfolioManager__factory,
} from '@dopex-io/sdk';
import { Button } from '@dopex-io/ui';
import { debounce } from 'lodash';
import { useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useStrikesData from 'hooks/option-amm/useStrikesData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import ExpirySelector from 'components/option-amm/AsidePanel/Dropdowns/ExpirySelector';
import OptionTypeSelector from 'components/option-amm/AsidePanel/Dropdowns/OptionTypeSelector';
import ManageMargin from 'components/option-amm/Dialog/ManageMargin';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface Props {
  inputPanel: React.ReactNode;
  data: {
    isShort: boolean;
    amount: string;
  };
  button: {
    label: string;
    handler: (e: any) => void;
    disabled: boolean;
  };
}

const Trade = (props: Props) => {
  const { inputPanel, button, data } = props;

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);
  const activeStrikeIndex = useVaultStore((store) => store.activeStrikeIndex);
  const { strikeData, expiryData } = useStrikesData({
    ammAddress: vault.address,
    duration: vault.duration,
    isPut: vault.isPut,
  });
  const { portfolioData } = useAmmUserData({
    ammAddress: vault.address,
    portfolioManager: vault.portfolioManager,
    account: address || zeroAddress,
    positionMinter: vault.positionMinter,
    lpAddress: vault.lp,
  });

  const [open, setOpen] = useState<boolean>(false);
  const [newMaintenanceMargin, setNewMaintenanceMargin] = useState<bigint>(0n);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const updatePortfolioMMFromInput = useCallback(async () => {
    if (!address || !expiryData) return;
    const isShort = data.isShort;
    const marginToLock = await readContract({
      abi: OptionAmm__factory.abi,
      address: vault.address,
      functionName: 'calculateMarginRequirement',
      args: [
        vault.isPut,
        strikeData[activeStrikeIndex].strike,
        BigInt(expiryData.expiry),
        parseUnits(data.amount, DECIMALS_TOKEN),
      ],
    });
    const _newMaintenanceMargin = await readContract({
      abi: OptionAmmPortfolioManager__factory.abi,
      address: vault.portfolioManager,
      functionName: 'getPortfolioHealthFromAddedMargin',
      args: [address, marginToLock, isShort],
    });

    setNewMaintenanceMargin(_newMaintenanceMargin);
  }, [activeStrikeIndex, address, data, expiryData, strikeData, vault]);

  useEffect(() => {
    debounce(async () => await updatePortfolioMMFromInput(), 500);
  }, [updatePortfolioMMFromInput]);

  return (
    <div className="space-y-3">
      <div className="bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        {inputPanel}
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <div className="w-1/2 p-3 space-y-2">
            <h3 className="text-xs text-stieglitz">Expiry</h3>
            <ExpirySelector />
          </div>
          <div className="flex-grow p-3 space-y-2">
            <h3 className="text-xs text-stieglitz">Side</h3>
            <OptionTypeSelector />
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-umbra rounded-xl p-3 space-y-2">
        <RowItem
          label="Current Health"
          content={<p>{formatUnits(portfolioData?.health || 0n, 4)}</p>}
        />
        <RowItem
          label="New Health"
          content={<p>{formatUnits(newMaintenanceMargin || 0n, 4)}</p>}
        />
        <RowItem
          label="Available Margin"
          content={
            <p>
              $
              {formatUnits(
                portfolioData?.availableCollateral || 0n,
                DECIMALS_USD,
              )}
            </p>
          }
        />
        <RowItem label="Fees" content={<p>-</p>} />
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200 bg-carbon"
          onClick={handleClick}
          color="mineshaft"
          size="small"
        >
          Add Margin
        </Button>
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200 bg-carbon"
          onClick={button.handler}
          disabled={button.disabled}
          size="small"
        >
          {button.label}
        </Button>
      </div>
      <ManageMargin open={open} handleClose={handleClose} />
    </div>
  );
};

export default Trade;
