import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import { Box, Input as MuiInput } from '@mui/material';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { ISpreadPair } from 'store/Vault/zdte';

import { Typography } from 'components/UI';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
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

const ONE_DAY = 24 * 3600;

function orZero(value: number): BigNumber {
  return value
    ? getContractReadableAmount(value, DECIMALS_STRIKE)
    : BigNumber.from(0);
}

function getUsdPrice(value: BigNumber): number {
  return value.mul(100).div(oneEBigNumber(DECIMALS_USD)).toNumber() / 100;
}

function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
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
    focusTrade,
    textInputRef,
    staticZdteData,
  } = useBoundStore();
  const zdteContract = getZdteContract();

  const [amount, setAmount] = useState<string | number>(0);
  const [margin, setMargin] = useState<string | number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [premium, setPremium] = useState<number>(0);
  const [openingFees, setOpeningFees] = useState<number>(0);
  const [canOpenSpread, setCanOpenSpread] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);

  const handleApprove = useCallback(async () => {
    if (!signer || !staticZdteData?.quoteTokenAddress) return;

    try {
      await sendTx(
        ERC20__factory.connect(staticZdteData?.quoteTokenAddress, signer),
        'approve',
        [staticZdteData?.zdteAddress, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [staticZdteData, signer, sendTx]);

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
        setAmount('0');
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
      if (!selectedSpreadPair?.shortStrike) return;

      const zdteContract = await getZdteContract();
      const ether = oneEBigNumber(DECIMALS_TOKEN);

      // # long >= current, long < short => isCall
      // # long <= current, long > short, => isPut
      const [longPremium, longOpeningFees, shortOpeningFees] =
        await Promise.all([
          zdteContract.calcPremium(
            selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
            orZero(selectedSpreadPair.longStrike),
            ether,
            ONE_DAY
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
    }

    async function validateApproval() {
      if (!signer || !accountAddress || !staticZdteData) return;
      try {
        const quoteTokenContract = await ERC20__factory.connect(
          staticZdteData?.quoteTokenAddress,
          signer
        );
        const allowance: BigNumber = await quoteTokenContract.allowance(
          accountAddress,
          staticZdteData?.zdteAddress
        );
        setApproved(
          allowance.gte(getContractReadableAmount(amount, DECIMALS_TOKEN))
        );
      } catch (err) {
        console.log(err);
      }
    }

    async function validateCanOpenSpread() {
      if (!selectedSpreadPair?.shortStrike || amount === 0) return;
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
        console.log(err);
      }
    }

    async function updateMargin() {
      if (!selectedSpreadPair?.shortStrike || amount === 0) return;
      try {
        const zdteContract = await getZdteContract();
        const requireMargin = await zdteContract.getMargin(
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
        let margin: number;
        // isPut
        if (selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike) {
          margin = getUserReadableAmount(requireMargin, DECIMALS_USD);
        } else {
          margin = getUserReadableAmount(requireMargin, DECIMALS_TOKEN);
        }
        setMargin(formatAmount(margin, 2));
      } catch (err) {
        console.log(err);
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
    focusTrade,
    textInputRef,
  ]);

  return (
    <Box className="rounded-xl space-y-2 p-2">
      <Box className="flex flex-row justify-between">
        <Box className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
          <Box className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
            <Typography variant="h6" className="mt-2 font-medium text-[0.8rem]">
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
          className="h-12 text-md text-white font-mono mr-2"
          value={amount}
          onChange={handleTradeAmount}
          classes={{ input: 'text-right' }}
        />
      </Box>
      <Box className="p-2 space-y-1">
        <ContentRow
          title="Balance"
          content={`${formatAmount(
            getUserReadableAmount(
              userZdteLpData?.userQuoteTokenBalance!,
              DECIMALS_USD
            ),
            2
          )} ${staticZdteData?.quoteTokenSymbol.toUpperCase()}`}
        />
        <ContentRow
          title="Premium"
          content={`$${roundToTwoDecimals(premium)}`}
        />
        <ContentRow
          title="Opening fees"
          content={`$${roundToTwoDecimals(openingFees)}`}
        />
        <ContentRow
          title="Margin required"
          content={
            selectedSpreadPair?.longStrike! > selectedSpreadPair?.shortStrike!
              ? `${margin} ${staticZdteData?.quoteTokenSymbol.toUpperCase()}`
              : `${margin} ${staticZdteData?.baseTokenSymbol.toUpperCase()}`
          }
        />
        <ContentRow
          title="Cost per spread"
          content={`$${roundToTwoDecimals(premium + openingFees)}`}
        />
        <ContentRow
          title="You will pay"
          content={`${formatAmount(
            (premium + openingFees) * Number(amount),
            2
          )} USDC`}
        />
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