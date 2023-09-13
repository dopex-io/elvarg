import { useMemo, useState } from 'react';
import { formatUnits, zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import ManageMargin from 'components/option-amm/Dialog/ManageMargin';

import { formatAmount } from 'utils/general';
import getMMSeverity, { LiquidationRisk } from 'utils/optionAmm/getMMSeverity';

import { DECIMALS_USD } from 'constants/index';

const InfoColumn = ({
  label,
  data,
}: {
  label: string;
  data: React.ReactNode | string;
}) => (
  <div className="flex flex-col md:flex-row-reverse space-x-0 md:space-x-1 text-left h-min my-auto">
    {data}
    <p className="text-stieglitz text-xs pr-0 md:pr-1">{label}</p>
  </div>
);

const PortfolioInfo = () => {
  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);
  const { portfolioData } = useAmmUserData({
    ammAddress: vault.address,
    portfolioManager: vault.portfolioManager,
    lpAddress: vault.lp,
    positionMinter: vault.positionMinter,
    account: address || zeroAddress,
  });

  const [open, setOpen] = useState<boolean>(false);

  const riskHighlighting = useMemo(() => {
    if (!portfolioData) return 'text-stieglitz';

    const liquidationRisk = getMMSeverity(
      portfolioData.health,
      portfolioData.liquidationThreshold,
    );

    switch (liquidationRisk) {
      case LiquidationRisk.Low:
        return 'text-up-only';
      case LiquidationRisk.Moderate:
        return 'text-jaffa';
      case LiquidationRisk.High:
        return 'text-down-bad';
      default:
        return 'text-stieglitz';
    }
  }, [portfolioData]);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className="flex flex-grow md:flex-grow-0 justify-around space-x-2 h-fit bg-cod-gray rounded-md p-2 self-end my-auto">
      <InfoColumn
        label="Health:"
        data={
          <p className={`${riskHighlighting} text-xs`}>
            {formatAmount(formatUnits(portfolioData?.health || 0n, 4))}
          </p>
        }
      />
      <InfoColumn
        label="Margin Balance:"
        data={
          <span className="flex text-xs space-x-1">
            <p>
              {formatAmount(
                formatUnits(portfolioData?.totalCollateral || 0n, DECIMALS_USD),
              )}
            </p>
            <p>{vault.collateralSymbol}</p>
          </span>
        }
      />
      <InfoColumn
        label="Available Margin:"
        data={
          <span className="flex text-xs space-x-1">
            <p>
              {formatAmount(
                formatUnits(
                  portfolioData?.availableCollateral || 0n,
                  DECIMALS_USD,
                ),
              )}
            </p>
            <p>{vault.collateralSymbol}</p>
          </span>
        }
      />
      <Button onClick={handleOpen} color="mineshaft" size="xsmall">
        <PlusCircleIcon className="w-[16px] hover:cursor-pointer text-stieglitz" />
      </Button>
      <ManageMargin open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default PortfolioInfo;
