import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { Button, Input } from '@dopex-io/ui';
import { useAccount } from 'wagmi';

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

const buttonSubGroupLabels = [
  ['Long', 'Short'],
  ['Deposit', 'Withdraw'],
];

enum PanelStates {
  'Trade' = 0,
  'Liquidity Provision' = 1,
}

const AsidePanel = ({ market }: { market: string }) => {
  const { address } = useAccount();

  const [activeIndexSub, setActiveIndexSub] = useState<number>(0);
  const [panelState, setPanelState] = useState<PanelStates>(PanelStates.Trade);
  const [amount, setAmount] = useState<string>('');
  const [userBalance, setUserBalance] = useState<bigint>(0n);

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

  useEffect(() => {
    async () => {
      const _balance = await getUserBalance({
        owner: address,
        tokenAddress: '0x',
      });
      setUserBalance(_balance || 0n);
    };
  }, [address]);

  const memoizedInputPanel = useMemo(() => {
    return (
      <Input
        variant="xl"
        type="number"
        value={amount}
        onChange={handleChange}
        leftElement={
          <img
            src={`/images/tokens/${market.split('-')[1]}.svg`}
            alt={''.toLowerCase()}
            className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
          />
        }
        bottomElement={
          <CustomBottomElement
            symbol={''}
            label={panelState === 0 ? 'Contracts' : 'Balance'}
            value={formatAmount(
              panelState === 0 ? 0 : Number(userBalance),
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
    <div className="flex flex-col space-y-4">
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
            data={[
              {
                label: 'New Health Factor',
                value: <p className="text-jaffa text-xs">-</p>,
              },
              {
                label: 'Margin Required',
                value: <p className="text-xs">-</p>,
              },
              {
                label: 'Available Margin',
                value: <p className="text-xs">-</p>,
              },
              {
                label: 'Fees',
                value: <p className="text-xs">-</p>,
              },
            ]}
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
          />
        )}
      </div>
    </div>
  );
};

export default AsidePanel;
