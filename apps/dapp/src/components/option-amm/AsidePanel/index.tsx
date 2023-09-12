import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

import {
  OptionAmm__factory,
  OptionAmmPortfolioManager__factory,
} from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import { debounce } from 'lodash';
import { useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useStrikesData from 'hooks/option-amm/useStrikesData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import PnlChart from 'components/common/PnlChart';
import LiquidityProvision from 'components/option-amm/AsidePanel/LiquidityProvision';
import Trade from 'components/option-amm/AsidePanel/Trade';
import {
  ButtonGroup,
  CustomBottomElement,
} from 'components/ssov-beta/AsidePanel';

import { getUserBalance } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';

export const ButtonGroupSub = ({
  active,
  labels,
  handleClick,
}: {
  active: number;
  labels: (React.ReactNode | string)[];
  handleClick: (i: number) => void;
}) => {
  return (
    <div className="flex w-full space-x-2 bg-mineshaft rounded-md p-1">
      {labels.map((label, i: number) => (
        <Button
          key={i}
          className={`flex-grow justify-center text-xs transition ease-in-out duration-200 ${
            active === i ? 'bg-carbon' : 'bg-transparent'
          }`}
          onClick={() => handleClick(i)}
          color="carbon"
          size="xsmall"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

enum PanelStates {
  'Trade' = 0,
  'Liquidity Provision' = 1,
}

const buttonSubGroupLabels = [
  ['Long', 'Short'],
  ['Deposit', 'Withdraw'],
];

const AsidePanel = ({ market }: { market: string }) => {
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
    positionMinter: vault.positionMinter,
    accountAddress: address || zeroAddress,
  });

  const [activeIndexSub, setActiveIndexSub] = useState<number>(0);
  const [panelState, setPanelState] = useState<PanelStates>(PanelStates.Trade);
  const [amount, setAmount] = useState<string>('');
  const [userBalance, setUserBalance] = useState<bigint>(0n);
  const [newMaintenanceMargin, setNewMaintenanceMargin] = useState<bigint>(0n);

  const handleClickButtonGroup = (index: number) => {
    setPanelState(index);
  };
  const handleClickSubGroup = (index: number) => {
    setActiveIndexSub(index);
  };

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmount(e.target.value);
  };

  const handleMax = useCallback(() => {
    setAmount(panelState === 0 ? '' : formatUnits(userBalance, DECIMALS_TOKEN));
  }, [panelState, userBalance]);

  const updatePortfolioMMFromInput = useCallback(async () => {
    if (!address || !expiryData) return;
    const isShort = activeIndexSub === 0 && panelState === 0;
    const marginToLock = await readContract({
      abi: OptionAmm__factory.abi,
      address: vault.address,
      functionName: 'calculateMarginRequirement',
      args: [
        vault.isPut,
        strikeData[activeStrikeIndex].strike,
        BigInt(expiryData.expiry),
        parseUnits(amount, DECIMALS_TOKEN),
      ],
    });
    const _newMaintenanceMargin = await readContract({
      abi: OptionAmmPortfolioManager__factory.abi,
      address: vault.portfolioManager,
      functionName: 'getPortfolioHealthFromAddedMargin',
      args: [address, marginToLock, isShort],
    });

    setNewMaintenanceMargin(_newMaintenanceMargin);
  }, [
    activeIndexSub,
    activeStrikeIndex,
    address,
    amount,
    expiryData,
    panelState,
    strikeData,
    vault.address,
    vault.isPut,
    vault.portfolioManager,
  ]);

  useEffect(() => {
    debounce(async () => await updatePortfolioMMFromInput(), 500);
  }, [updatePortfolioMMFromInput]);

  useEffect(() => {
    (async () => {
      if (!address || vault.underlyingAddress === '0x') return;
      const _balance = await getUserBalance({
        owner: address,
        tokenAddress: vault.underlyingAddress,
      });
      setUserBalance(_balance || 0n);
    })();
  }, [address, vault.underlyingAddress]);

  const memoizedInputPanel = useMemo(() => {
    return (
      <Input
        variant="xl"
        type="number"
        value={amount}
        onChange={handleChange}
        leftElement={
          <img
            src={`/images/tokens/${market.split('-')[1].toLowerCase()}.svg`}
            alt={''.toLowerCase()}
            className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
          />
        }
        bottomElement={
          <CustomBottomElement
            symbol={''}
            label={panelState === 0 ? 'Options' : 'Balance'}
            value={formatAmount(
              panelState === 0
                ? 0
                : Number(formatUnits(userBalance, DECIMALS_TOKEN)),
              3,
              true,
            )}
            role="button"
            onClick={handleMax}
          />
        }
        placeholder="0.0"
      />
    );
  }, [panelState, amount, handleMax, market, userBalance]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col bg-cod-gray rounded-xl p-3 space-y-3">
        <ButtonGroup
          active={panelState}
          labels={Object.values(PanelStates).filter((state) =>
            isNaN(Number(state)),
          )}
          handleClick={handleClickButtonGroup}
        />
        <ButtonGroupSub
          active={activeIndexSub}
          labels={buttonSubGroupLabels[panelState]}
          handleClick={handleClickSubGroup}
        />
        {panelState === PanelStates.Trade ? (
          <Trade
            inputPanel={memoizedInputPanel}
            data={{
              strike: strikeData[activeStrikeIndex]?.strike || 0n,
              health: portfolioData?.health || 0n,
              newMaintenanceMargin: newMaintenanceMargin,
              availableCollateral: portfolioData?.availableCollateral || 0n,
            }}
            button={{
              handler: () => {},
              disabled: false,
              label: buttonSubGroupLabels[panelState][activeIndexSub],
            }}
          />
        ) : (
          <LiquidityProvision
            inputPanel={memoizedInputPanel}
            data={[
              {
                label: 'TVL',
                value: <p className="text-xs">-</p>,
              },
              {
                label: 'APR',
                value: <p className="text-xs">-</p>,
              },
            ]}
            button={{
              handler: () => {},
              disabled: false,
              label: buttonSubGroupLabels[panelState][activeIndexSub],
            }}
          />
        )}
      </div>
      <div className="bg-cod-gray p-3 rounded-lg">
        {/* @todo: replace mock data */}
        <PnlChart
          breakEven={1.2}
          optionPrice={0.2}
          amount={Number(amount)}
          isPut={false}
          price={1}
          symbol={market.split('-')[0]}
        />
      </div>
    </div>
  );
};

export default AsidePanel;
