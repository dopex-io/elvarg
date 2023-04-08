import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import { Box, Input as MuiInput } from '@mui/material';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { ISpreadPair } from 'store/Vault/zdte';

import { Typography } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import PnlChart from 'components/zdte/Manage/PnlChart';
import TradeButton from 'components/zdte/Manage/TradeCard/TradeButton';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { formatAmount } from 'utils/general';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  MAX_VALUE,
} from 'constants/index';

function orZero(value: number): BigNumber {
  return value
    ? getContractReadableAmount(value, DECIMALS_STRIKE)
    : BigNumber.from(0);
}

function getUsdPrice(value: BigNumber): number {
  return value.mul(100).div(oneEBigNumber(DECIMALS_USD)).toNumber() / 100;
}

export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

export function getMaxPayoff(
  selectedSpreadPair: ISpreadPair | undefined,
  premium: number
) {
  if (
    !selectedSpreadPair ||
    !selectedSpreadPair.shortStrike ||
    !selectedSpreadPair.longStrike
  ) {
    return 0;
  }
  return (
    Math.abs(selectedSpreadPair.longStrike - selectedSpreadPair.shortStrike) -
    premium
  );
}

function getStrikeDisplay(
  selectedSpreadPair: ISpreadPair | undefined,
  tokenPrice: number | undefined
): ReactNode {
  const defaultDisplay: string = 'Select Strike(s)';
  if (selectedSpreadPair === undefined || tokenPrice === undefined) {
    return defaultDisplay;
  }
  const longStrike = selectedSpreadPair.longStrike;
  const shortStrike = selectedSpreadPair.shortStrike;
  let prefix = '';
  let suffix = '';
  if (selectedSpreadPair === undefined || longStrike === undefined) {
    return defaultDisplay;
  } else if (shortStrike !== undefined && longStrike > shortStrike) {
    prefix = `${longStrike}-P`;
    suffix = `${shortStrike}-P`;
  } else if (shortStrike !== undefined && longStrike < shortStrike) {
    prefix = `${longStrike}-C`;
    suffix = `${shortStrike}-C`;
  } else if (longStrike >= tokenPrice) {
    prefix = `${longStrike}-C`;
  } else {
    prefix = `${longStrike}-P`;
  }
  return (
    <span className="text-sm text-up-only">
      {prefix}
      <span className="text-sm text-white"> / </span>
      <span className="text-sm text-down-bad">{suffix}</span>
    </span>
  );
}

interface TradeProps {}

const TradeCard: FC<TradeProps> = ({}) => {
  const sendTx = useSendTx();

  const {
    signer,
    provider,
    getZdteContract,
    updateZdteData,
    zdteData,
    accountAddress,
    userZdteLpData,
    selectedSpreadPair,
    setSelectedSpreadPair,
    textInputRef,
    staticZdteData,
  } = useBoundStore();
  const zdteContract = getZdteContract();

  const [amount, setAmount] = useState<string | number>(1);
  const [margin, setMargin] = useState<string | number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [premium, setPremium] = useState<number>(0);
  const [openingFees, setOpeningFees] = useState<number>(0);
  const [canOpenSpread, setCanOpenSpread] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);

  const handleApprove = useCallback(async () => {
    if (!signer || !staticZdteData?.quoteTokenAddress || !accountAddress)
      return;
    try {
      const tokenContract = await ERC20__factory.connect(
        staticZdteData?.quoteTokenAddress,
        signer
      );
      const minAmountToApprove = Math.round(
        (premium + openingFees) * Number(amount)
      );
      await sendTx(tokenContract, 'approve', [
        staticZdteData?.zdteAddress,
        MAX_VALUE,
      ]);
      const allowance: BigNumber = await tokenContract.allowance(
        accountAddress,
        staticZdteData?.zdteAddress
      );
      setApproved(
        allowance.gte(
          getContractReadableAmount(minAmountToApprove, DECIMALS_USD)
        )
      );
    } catch (err) {
      console.log(err);
    }
  }, [staticZdteData, signer, sendTx, amount, accountAddress]);

  const handleTradeAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) =>
      setAmount(e.target.value),
    []
  );

  const handleOpenPosition = useCallback(async () => {
    if (!signer || !provider || !zdteContract || !selectedSpreadPair) return;
    try {
      await sendTx(zdteContract.connect(signer), 'spreadOptionPosition', [
        selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
        getContractReadableAmount(amount, DECIMALS_TOKEN),
        getContractReadableAmount(
          selectedSpreadPair.longStrike,
          DECIMALS_STRIKE
        ),
        getContractReadableAmount(
          selectedSpreadPair.shortStrike,
          DECIMALS_STRIKE
        ),
      ]).then(() => {
        setAmount('');
        setSelectedSpreadPair({
          ...selectedSpreadPair,
          shortStrike: undefined,
          longStrike: undefined,
        });
      });
      await updateZdteData();
    } catch (e) {
      console.log(e);
      throw new Error('fail to open position');
    }
  }, [
    signer,
    provider,
    zdteContract,
    amount,
    updateZdteData,
    selectedSpreadPair,
    setSelectedSpreadPair,
    sendTx,
  ]);

  useEffect(() => {
    async function updatePremiumAndFees() {
      if (!selectedSpreadPair?.longStrike || !selectedSpreadPair?.shortStrike) {
        setPremium(0);
        setOpeningFees(0);
        return;
      }

      try {
        const zdteContract = await getZdteContract();
        const ether = oneEBigNumber(DECIMALS_TOKEN);

        // # long >= current, long < short => isCall
        // # long <= current, long > short, => isPut
        const [longPremium, longOpeningFees, shortOpeningFees] =
          await Promise.all([
            zdteContract.calcPremium(
              selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
              orZero(selectedSpreadPair.longStrike),
              ether
            ),
            zdteContract.calcOpeningFees(
              ether,
              orZero(selectedSpreadPair.longStrike)
            ),
            zdteContract.calcOpeningFees(
              ether,
              orZero(selectedSpreadPair.shortStrike)
            ),
          ]);
        setPremium(getUsdPrice(longPremium));
        setOpeningFees(getUsdPrice(longOpeningFees.add(shortOpeningFees)));
      } catch (err) {
        console.log('updatePremiumAndFees: ', err);
      }
    }

    async function validateApproval() {
      if (!signer || !accountAddress || !staticZdteData || !amount) return;
      try {
        const quoteTokenContract = await ERC20__factory.connect(
          staticZdteData?.quoteTokenAddress,
          signer
        );
        const allowance: BigNumber = await quoteTokenContract.allowance(
          accountAddress,
          staticZdteData?.zdteAddress
        );
        const toApproveAmount = Math.max(
          Number(amount),
          Math.round((premium + openingFees) * Number(amount))
        );
        const toOpen = getContractReadableAmount(toApproveAmount, DECIMALS_USD);
        setApproved(allowance.gte(toOpen));
      } catch (err) {
        console.log('validateApproval: ', err);
      }
    }

    async function validateCanOpenSpread() {
      if (!selectedSpreadPair?.shortStrike || !amount) return;
      try {
        const zdteContract = await getZdteContract();
        const sufficient = await zdteContract.canOpenSpreadPosition(
          selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
          getContractReadableAmount(amount, DECIMALS_TOKEN),
          getContractReadableAmount(
            selectedSpreadPair.longStrike,
            DECIMALS_STRIKE
          ),
          getContractReadableAmount(
            selectedSpreadPair.shortStrike,
            DECIMALS_STRIKE
          )
        );
        setCanOpenSpread(sufficient);
      } catch (err) {
        console.log('validateCanOpenSpread: ', err);
      }
    }

    async function updateMargin() {
      if (
        !selectedSpreadPair?.longStrike ||
        !selectedSpreadPair?.shortStrike ||
        !amount
      ) {
        setMargin(0);
        return;
      }

      try {
        const zdteContract = await getZdteContract();
        const requireMargin = await zdteContract.calcMargin(
          selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
          getContractReadableAmount(
            selectedSpreadPair.longStrike,
            DECIMALS_STRIKE
          ),
          getContractReadableAmount(
            selectedSpreadPair.shortStrike,
            DECIMALS_STRIKE
          )
        );
        let margin;
        if (selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike) {
          margin = getUserReadableAmount(requireMargin, DECIMALS_USD);
        } else {
          margin = getUserReadableAmount(requireMargin, DECIMALS_TOKEN);
        }
        margin = margin * Number(amount);
        setMargin(formatAmount(margin, 2));
      } catch (err) {
        console.log('updateMargin: ', err);
      }
    }
    updatePremiumAndFees();
    validateApproval();
    validateCanOpenSpread();
    updateMargin();

    if (textInputRef) textRef.current?.focus();
  }, [
    staticZdteData,
    selectedSpreadPair,
    getZdteContract,
    signer,
    accountAddress,
    amount,
    textInputRef,
    premium,
    openingFees,
    zdteData,
    setApproved,
    setCanOpenSpread,
    setMargin,
    handleApprove,
  ]);

  return (
    <Box className="rounded-xl space-y-2 p-2">
      <div>
        <Box className="flex flex-row justify-between">
          <Box className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <Typography
                variant="h6"
                className="mt-2 font-medium text-[0.8rem]"
              >
                {getStrikeDisplay(selectedSpreadPair, zdteData?.tokenPrice)}
              </Typography>
            </Box>
          </Box>
          <MuiInput
            inputRef={textRef}
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="1"
            onFocus={() => {
              setAmount('');
            }}
            type="number"
            className="h-16 text-md text-white font-mono mr-2"
            value={amount}
            onChange={handleTradeAmount}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <div className="flex justify-between">
          <Box className=" flex mr-2 border border-white rounded-md ">
            {[10, 25, 50, 75, 100].map((option, i) => (
              <Box
                key={i}
                className={`text-center w-auto cursor-pointer group hover:bg-mineshaft hover:opacity-80`}
                onClick={() => setSelectedMargin(option)}
              >
                <Typography
                  variant="h6"
                  className="text-xs font-light py-2 px-2"
                >
                  {option}%
                </Typography>
              </Box>
            ))}
          </Box>
          <span className="mt-2 text-sm">
            {`${formatAmount(
              getUserReadableAmount(
                userZdteLpData?.userQuoteTokenBalance!,
                DECIMALS_USD
              ),
              2
            )} ${staticZdteData?.quoteTokenSymbol.toUpperCase()}`}
          </span>
        </div>
      </div>
      <Box className="p-1 space-y-1">
        <ContentRow
          title="Liquidity required"
          content={
            selectedSpreadPair?.longStrike! > selectedSpreadPair?.shortStrike!
              ? `${margin} ${staticZdteData?.quoteTokenSymbol.toUpperCase()}`
              : `${margin} ${staticZdteData?.baseTokenSymbol.toUpperCase()}`
          }
        />
        <ContentRow
          title="Premium"
          content={`$${roundToTwoDecimals(premium)}`}
        />
        <ContentRow
          title="Fees"
          content={`$${roundToTwoDecimals(openingFees)}`}
        />
        <ContentRow
          title="Cost per spread"
          content={`$${roundToTwoDecimals(premium + openingFees)}`}
        />
        <div className="p-1">
          <PnlChart
            premium={premium}
            selectedSpreadPair={selectedSpreadPair!}
            amount={Number(amount)}
          />
        </div>
        {/* <ContentRow
          title="You will pay"
          content={`${formatAmount(
            (premium + openingFees) * Number(amount),
            2
          )} USDC`}
        /> */}
      </Box>
      <TradeButton
        amount={amount}
        selectedSpreadPair={selectedSpreadPair!}
        userZdteLpData={userZdteLpData!}
        handleApprove={handleApprove}
        handleOpenPosition={handleOpenPosition}
        approved={approved}
        canOpenSpread={canOpenSpread}
      />
    </Box>
  );
};

export default TradeCard;
