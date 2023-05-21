import { useEffect, useMemo, useState } from 'react';

import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

const ButtonGroup = ({
  active,
  labels,
  handleClick,
}: {
  active: boolean;
  labels: string[];
  handleClick: () => void;
}) => {
  return (
    <div className="flex">
      {labels.map((label, i: number) => (
        <p
          key={i}
          role="button"
          className={`text-sm font-bold transition ease-in-out duration-500 ${
            active ? 'text-white' : 'text-stieglitz'
          }`}
          onClick={handleClick}
        >
          {label}
        </p>
      ))}
    </div>
  );
};

const AsidePanel = () => {
  const { selectedVaultData } = useBoundStore();

  const [isLp, setisLp] = useState<boolean>(false);

  const tx = useSendTx();

  const handleClick = () => {
    setisLp(!isLp);
  };

  const strikeData = useMemo(() => {
    if (
      !selectedVaultData ||
      !selectedVaultData.epochData ||
      !selectedVaultData.epochData.strikeData
    )
      return {
        isPut: false,
        strike: 0,
        totalPremium: 0,
        iv: 0,
        totalAvailableCollateral: 0,
        breakeven: 0,
        optionSize: 0,
        balance: 0,
      };
  }, [selectedVaultData]);

  useEffect(() => {
    (async () => {
      if (!selectedVaultData?.contractWithSigner) return;
      // await tx(selectedVaultData?.contractWithSigner, 'purchase', []);
    })();
  });

  return (
    <div className="flex flex-col bg-cod-gray rounded-lg p-3">
      <ButtonGroup
        active={isLp}
        labels={['Buy', 'Sell']}
        handleClick={handleClick}
      />
    </div>
  );
};

export default AsidePanel;
