import { useMemo, useState } from 'react';
import { zeroAddress } from 'viem';

import { Skeleton } from '@dopex-io/ui';
import { useAccount } from 'wagmi';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import LongOrShortPositions from 'components/option-amm/Tables/Positions/LongOrShortPositions';
import { ButtonGroup } from 'components/ssov-beta/AsidePanel';

const Positions = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);
  const { optionPositions, loading } = useAmmUserData({
    ammAddress: vault.address,
    portfolioManager: vault.portfolioManager,
    positionMinter: vault.positionMinter,
    lpAddress: vault.lp,
    account: address || zeroAddress,
  });

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const buttonLabels = useMemo(() => {
    if (!optionPositions || optionPositions.length === 0) return [null, null];
    return [
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Long Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{optionPositions.filter((op) => !op.isShort).length}</span>
        </div>
      </div>,
      <div className="flex space-x-2 my-auto" key="buy-positions">
        <span>Short Positions</span>
        <div className="rounded-full bg-carbon w-5 h-auto flex items-center justify-center">
          <span>{optionPositions.filter((op) => op.isShort).length}</span>
        </div>
      </div>,
    ];
  }, [optionPositions]);

  const renderComponent = useMemo(() => {
    if (loading)
      return (
        <div className="bg-cod-gray rounded-lg pt-3">
          <div className="grid grid-cols-1 gap-4 p-2">
            {Array.from(Array(4)).map((_, index) => {
              return (
                <Skeleton
                  key={index}
                  width="fitContent"
                  height={70}
                  color="carbon"
                  variant="rounded"
                />
              );
            })}
          </div>
        </div>
      );
    else {
      return (
        <LongOrShortPositions
          positions={optionPositions.filter((op) =>
            activeIndex === 0 ? !op.isShort : op.isShort,
          )}
          isLoading={loading}
        />
      );
    }
  }, [activeIndex, loading, optionPositions]);

  return (
    <div className="space-y-2">
      <ButtonGroup
        active={activeIndex}
        labels={buttonLabels}
        handleClick={handleClick}
      />
      {renderComponent}
    </div>
  );
};

export default Positions;
