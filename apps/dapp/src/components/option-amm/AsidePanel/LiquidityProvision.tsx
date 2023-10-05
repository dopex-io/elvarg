import { formatUnits, zeroAddress } from 'viem';

import { Button } from '@dopex-io/ui';
import { formatDistanceToNow } from 'date-fns';
import { useAccount } from 'wagmi';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_USD } from 'constants/index';

interface Props {
  inputPanel: React.ReactNode;
  button: {
    label: string;
    disabled: boolean;
    handler: () => void;
  };
}

const LiquidityProvision = (props: Props) => {
  const { inputPanel, button } = props;

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);
  const { lpData } = useAmmUserData({
    ammAddress: vault.address,
    lpAddress: vault.lp,
    portfolioManager: vault.portfolioManager,
    positionMinter: vault.positionMinter,
    account: address || zeroAddress,
  });

  return (
    <div className="space-y-3">
      <div className="bg-umbra rounded-xl divide-y divide-cod-gray">
        {inputPanel}
      </div>
      <div className="border border-carbon rounded-lg divide-y divide-carbon">
        <div className="flex justify-between text-xs p-3">
          <p className="text-stieglitz">TVL</p>
          <span className="flex space-x-1 text-stieglitz">
            <p className="text-white">
              {formatAmount(
                formatUnits(lpData?.totalSupply || 0n, DECIMALS_USD),
                3,
              )}
            </p>
            <p>{vault.collateralSymbol}</p>
          </span>
        </div>
        <div className="flex justify-between text-xs p-3">
          <p className="text-stieglitz">APR</p>
          <p>-</p>
        </div>
      </div>
      <div className="flex flex-col bg-umbra p-3 rounded-xl space-y-3">
        <div className="flex justify-between text-xs">
          <p className="text-stieglitz">Withdrawable</p>
          <p>
            {lpData?.userUnlockTime
              ? formatDistanceToNow(Number(lpData?.userUnlockTime) * 1000, {
                  includeSeconds: true,
                })
              : '-'}
          </p>
        </div>
        <div className="flex justify-between text-xs text-stieglitz">
          <p>Your Shares</p>
          <span className="flex space-x-1">
            <p className="text-white">
              {formatAmount(
                formatUnits(lpData?.userShares || 0n, DECIMALS_USD),
              )}
            </p>
            <p>{vault.collateralSymbol}</p>
          </span>
        </div>
        <div className="flex justify-between text-xs text-stieglitz">
          <p>Available Liquidity</p>
          <span className="flex space-x-1">
            <p className="text-white">
              {formatAmount(
                formatUnits(lpData?.totalAvailableAssets || 0n, DECIMALS_USD),
              )}
            </p>
            <p>{vault.collateralSymbol}</p>
          </span>
        </div>
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200"
          onClick={button.handler}
          disabled={button.disabled}
          size="small"
        >
          {button.label}
        </Button>
      </div>
    </div>
  );
};

export default LiquidityProvision;
