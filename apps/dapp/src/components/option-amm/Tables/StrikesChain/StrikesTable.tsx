import { SyntheticEvent, useMemo } from 'react';
import { formatUnits } from 'viem';

import useStrikesData from 'hooks/option-amm/useStrikesData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import TableLayout from 'components/common/TableLayout';
import columns from 'components/option-amm/Tables/StrikesChain/ColumnHelper';
import TableDisclosure, {
  DisclosureStrikeItem,
} from 'components/option-amm/Tables/StrikesChain/TableDisclosure';

import { DECIMALS_STRIKE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

export interface StrikeItem {
  strike: number;
  breakeven: string;
  availableCollateral: {
    strike: number;
    totalCollateral: number;
    totalAvailableCollateral: number;
  };
  premiumAccrued: number;
  button: {
    index: number;
    disabled: boolean;
    base: string;
    premiumPerOption: bigint;
    activeStrikeIndex: number;
    setActiveStrikeIndex: () => void;
    handleSelection: React.ReactEventHandler;
  };
  disclosure: DisclosureStrikeItem;
}

const StrikesTable = () => {
  const activeStrikeIndex = useVaultStore((store) => store.activeStrikeIndex);
  const vault = useVaultStore((store) => store.vault);
  const setActiveStrikeIndex = useVaultStore(
    (store) => store.setActiveStrikeIndex,
  );

  const { expiryData, strikeData, greeks, loading } = useStrikesData({
    ammAddress: vault.address,
    duration: vault.duration,
    isPut: vault.isPut,
  });

  const data = useMemo(() => {
    if (!strikeData || !greeks || !expiryData) return [];

    return strikeData.map((sd, index) => {
      const isITM: boolean = vault.isPut
        ? sd.strike > expiryData.markPrice
        : sd.strike < expiryData.markPrice;
      return {
        strike: Number(formatUnits(sd.strike || 0n, DECIMALS_STRIKE)),
        breakeven: formatUnits(
          vault.isPut
            ? sd.strike || 0n - sd.premiumPerOption || 0n
            : sd.strike || 0n + sd.premiumPerOption || 0n,
          DECIMALS_STRIKE,
        ),
        availableCollateral: {
          strike: Number(
            formatUnits(sd.availableCollateral || 0n, DECIMALS_TOKEN),
          ),
          totalCollateral: Number(
            formatUnits(sd.totalCollateral, DECIMALS_TOKEN),
          ),
          totalAvailableCollateral: Number(
            formatUnits(sd.totalAvailableCollateral, DECIMALS_TOKEN),
          ),
        },
        premiumAccrued: Number(formatUnits(sd.premiumsAccrued, DECIMALS_USD)),
        button: {
          index,
          disabled: isITM,
          base: vault.collateralSymbol,
          quote: vault.underlyingSymbol,
          premiumPerOption: sd.premiumPerOption || 0n,
          activeStrikeIndex: activeStrikeIndex,
          setActiveStrikeIndex: () => setActiveStrikeIndex(index),
          handleSelection: (e: SyntheticEvent) => {
            console.log(e);
          },
        },
        disclosure: {
          iv: greeks[index].iv,
          delta: greeks[index].delta,
          theta: greeks[index].theta,
          gamma: greeks[index].gamma,
          vega: greeks[index].vega,
        },
      };
    });
  }, [
    strikeData,
    greeks,
    expiryData,
    vault.isPut,
    vault.collateralSymbol,
    vault.underlyingSymbol,
    activeStrikeIndex,
    setActiveStrikeIndex,
  ]);

  return (
    <TableLayout<StrikeItem>
      isContentLoading={loading}
      columns={columns}
      data={data}
      rowSpacing={3}
      pageSize={20}
      disclosure={greeks.map((s, index) => (
        <TableDisclosure key={index} {...s} />
      ))}
    />
  );
};

export default StrikesTable;
