import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

import { OptionAmmLp__factory } from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import PnlChart from 'components/common/PnlChart';
import LiquidityProvision from 'components/option-amm/AsidePanel/LiquidityProvision';
import Trade from 'components/option-amm/AsidePanel/Trade';
import {
  ButtonGroup,
  CustomBottomElement,
} from 'components/ssov-beta/AsidePanel';

import { getAllowance, getUserBalance } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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
  const [activeIndexSub, setActiveIndexSub] = useState<number>(0);
  const [panelState, setPanelState] = useState<PanelStates>(PanelStates.Trade);
  const [amount, setAmount] = useState<string>('');
  const [userBalance, setUserBalance] = useState<bigint>(0n);
  const [approved, setApproved] = useState<boolean>(false);

  const { address } = useAccount();
  const vault = useVaultStore((store) => store.vault);
  const { updateLpData } = useAmmUserData({
    ammAddress: vault.address,
    lpAddress: vault.lp,
    positionMinter: vault.positionMinter,
    portfolioManager: vault.portfolioManager,
    account: address || zeroAddress,
  });
  const { write: approve } = useContractWrite({
    address: vault.collateralTokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      panelState === PanelStates['Liquidity Provision']
        ? vault.lp
        : vault.address,
      parseUnits(amount, DECIMALS_USD),
    ],
  });
  const { write: deposit } = useContractWrite({
    address: vault.lp,
    abi: OptionAmmLp__factory.abi,
    functionName: 'deposit',
    args: [parseUnits(amount, DECIMALS_USD), address || '0x'],
  });
  const { write: withdraw } = useContractWrite({
    address: vault.lp,
    abi: OptionAmmLp__factory.abi,
    functionName: 'withdraw',
    args: [parseUnits(amount, DECIMALS_USD), address || '0x', address || '0x'],
  });

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

  const handleLpAction = useCallback(async () => {
    if (activeIndexSub === 0) deposit();
    else withdraw();
    updateLpData();
  }, [activeIndexSub, deposit, updateLpData, withdraw]);

  useEffect(() => {
    (async () => {
      if (!address || vault.underlyingTokenAddress === '0x') return;
      const _balance = await getUserBalance({
        owner: address,
        tokenAddress: vault.underlyingTokenAddress,
      });
      setUserBalance(_balance || 0n);
    })();
  }, [address, vault.underlyingTokenAddress]);

  useEffect(() => {
    (async () => {
      if (!address || vault.collateralTokenAddress === '0x') return;

      const allowance = await getAllowance({
        owner: address,
        spender:
          panelState === PanelStates['Liquidity Provision']
            ? vault.lp
            : vault.address,
        tokenAddress: vault.collateralTokenAddress,
      });
      setApproved(allowance >= parseUnits(amount, DECIMALS_USD));
    })();
  }, [address, amount, panelState, vault]);

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
            alt={market.split('-')[1].toLowerCase()}
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

  const contractTxButton = useMemo(() => {
    if (amount === '0' || amount === '') {
      return {
        disabled: true,
        label: 'Enter Amount',
        handler: () => null,
      };
    } else if (
      !approved &&
      !(panelState !== PanelStates.Trade && activeIndexSub !== 0) // if not approved, and not in withdraw panel
    ) {
      return {
        disabled: false,
        label: 'Approve',
        handler: () => {
          approve();
        },
      };
    } else if (panelState === PanelStates['Liquidity Provision']) {
      return {
        disabled: false,
        label: activeIndexSub === 0 ? 'Deposit' : 'Withdraw',
        handler: handleLpAction,
      };
    } else {
      return {
        disabled: true,
        label: activeIndexSub === 0 ? 'Long' : 'Short',
        handler: () => {}, // todo: implement
      };
    }
  }, [activeIndexSub, amount, approve, approved, handleLpAction, panelState]);

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
              isShort: activeIndexSub === 0,
              amount,
            }}
            button={contractTxButton}
          />
        ) : (
          <LiquidityProvision
            inputPanel={memoizedInputPanel}
            button={contractTxButton}
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
