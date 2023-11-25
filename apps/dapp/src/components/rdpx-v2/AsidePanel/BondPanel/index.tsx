import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAccount } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import blockerMessages from 'components/rdpx-v2/AsidePanel/BondPanel/blockerMessages';
import Bond from 'components/rdpx-v2/AsidePanel/BondPanel/Bond';
import Delegate from 'components/rdpx-v2/AsidePanel/BondPanel/Delegate';
import PanelBlocker from 'components/rdpx-v2/AsidePanel/BondPanel/PanelBlocker';
import Typography2 from 'components/UI/Typography2';

import { RDPX_V2_STATE } from 'constants/env';

const BUTTON_LABELS = ['Bond', 'Delegate'];

const BondPanel = () => {
  const [active, setActive] = useState<string>('Bond');
  const { address: user = '0x' } = useAccount();

  const { updatePerpetualVaultState, perpetualVaultState } = usePerpPoolData({
    user,
  });

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

  // Handle overlay of the panel for the bootstrap phase
  const panelState = useMemo(() => {
    if (perpetualVaultState.expiry === 0n) return null;
    switch (RDPX_V2_STATE) {
      case 'BOOTSTRAP':
        return blockerMessages.bootstrapPhase;
      case 'OVERRIDE':
        return blockerMessages.override;
      case undefined:
        if (
          perpetualVaultState.expiry <
          BigInt(Math.floor(new Date().getTime() / 1000))
        ) {
          return blockerMessages.expired;
        } else {
          return null;
        }
      default:
        return null;
    }
  }, [perpetualVaultState.expiry]);

  return (
    <div className="space-y-2 bg-cod-gray rounded-xl p-3 relative">
      {panelState ? (
        <PanelBlocker title={panelState.title} body={panelState.body} />
      ) : null}
      <div className="flex w-full justify-between">
        <div className="flex">
          {BUTTON_LABELS.map((label, index) => (
            <button
              key={index}
              className="flex border-0 mr-2 transition ease-in-out duration-500 rounded-md bg-transparent hover:bg-transparent hover:text-white"
              onClick={handleClick}
            >
              <Typography2
                variant="subtitle2"
                weight="400"
                color={active === label ? 'white' : 'stieglitz'}
              >
                {label}
              </Typography2>
            </button>
          ))}
        </div>
        <a
          href="https://app.1inch.io/#/42161/simple/swap/ETH/WETH"
          className="text-xs underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wrap ETH
        </a>
      </div>
      {active === 'Bond' ? <Bond /> : <Delegate />}
    </div>
  );
};

export default BondPanel;