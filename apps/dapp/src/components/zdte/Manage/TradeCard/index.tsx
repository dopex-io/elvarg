import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { BigNumber } from 'ethers';

import { ERC20__factory } from '@dopex-io/sdk';
import { Input as MuiInput } from '@mui/material';
import useSendTx from 'hooks/useSendTx';
import Countdown from 'react-countdown';
import { useBoundStore } from 'store';

import { ISpreadPair } from 'store/Vault/zdte';

import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import PnlChart from 'components/zdte/Manage/PnlChart';
import TradeButton from 'components/zdte/Manage/TradeCard/TradeButton';
import { addZeroes } from 'components/zdte/OptionsTable/OptionsTableRow';

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

export function getMaxPayoffPerOption(
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
    prefix = `${addZeroes(longStrike.toString())}-P`;
    suffix = `${addZeroes(shortStrike.toString())}-P`;
  } else if (shortStrike !== undefined && longStrike < shortStrike) {
    prefix = `${addZeroes(longStrike.toString())}-C`;
    suffix = `${addZeroes(shortStrike.toString())}-C`;
  } else if (longStrike >= tokenPrice) {
    prefix = `${addZeroes(longStrike.toString())}-C`;
  } else {
    prefix = `${addZeroes(longStrike.toString())}-P`;
  }
  return (
    <span className="text-sm text-up-only">
      {prefix}
      <span className="text-sm text-white"> / </span>
      <span className="text-sm text-down-bad">{suffix}</span>
    </span>
  );
}

const TradeCard = () => {
  const sendTx = useSendTx();

  const {
    signer,
    provider,
    getZdteContract,
    updateZdteData,
    updateUserZdtePurchaseData,
    updateVolumeFromSubgraph,
    zdteData,
    accountAddress,
    userZdteLpData,
    selectedSpreadPair,
    setSelectedSpreadPair,
    textInputRef,
    staticZdteData,
    setTextInputRef,
  } = useBoundStore();
  const zdteContract = getZdteContract();

  const [amount, setAmount] = useState<string | number>(1);
  const [margin, setMargin] = useState<string | number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [premium, setPremiumPerOption] = useState<number>(0);
  const [openingFees, setOpeningFeesPerOption] = useState<number>(0);
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
      console.error('fail to approve', err);
    }
  }, [
    staticZdteData,
    signer,
    sendTx,
    amount,
    accountAddress,
    openingFees,
    premium,
  ]);

  const handleTradeAmount = (e: {
    target: { value: React.SetStateAction<string | number> };
  }) => setAmount(e.target.value);

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
        setAmount('1');
        setTextInputRef(false);
        setSelectedSpreadPair({
          ...selectedSpreadPair,
          shortStrike: undefined,
          longStrike: undefined,
        });
      });
      await Promise.all([
        updateZdteData(),
        updateUserZdtePurchaseData(),
        updateVolumeFromSubgraph(),
      ]);
    } catch (err) {
      console.error('fail to open position', err);
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
    setTextInputRef,
    updateVolumeFromSubgraph,
    updateUserZdtePurchaseData,
  ]);

  useEffect(() => {
    if (textInputRef) textRef.current?.focus();
  }, [textInputRef]);

  useEffect(() => {
    async function updatePremiumAndFees() {
      if (!selectedSpreadPair?.longStrike && !selectedSpreadPair?.shortStrike) {
        setPremiumPerOption(0);
        setOpeningFeesPerOption(0);
        return;
      }

      try {
        const zdteContract = await getZdteContract();
        const ether = oneEBigNumber(DECIMALS_TOKEN);

        // # long >= current, long < short => isCall
        // # long <= current, long > short, => isPut
        const [longPremium, shortPremium, longOpeningFees, shortOpeningFees] =
          await Promise.all([
            zdteContract.calcPremiumCustom(
              selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
              orZero(selectedSpreadPair.longStrike),
              ether
            ),
            zdteContract.calcPremium(
              selectedSpreadPair.longStrike > selectedSpreadPair.shortStrike,
              orZero(selectedSpreadPair.shortStrike),
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
        setPremiumPerOption(
          getUserReadableAmount(longPremium.sub(shortPremium), DECIMALS_USD)
        );
        setOpeningFeesPerOption(
          getUserReadableAmount(
            longOpeningFees.add(shortOpeningFees),
            DECIMALS_USD
          )
        );
      } catch (err) {
        console.error('fail to updatePremiumAndFees: ', err);
      }
    }
    updatePremiumAndFees();
  }, [selectedSpreadPair, getZdteContract]);

  useEffect(() => {
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
        console.error('fail to validateApproval: ', err);
      }
    }
    validateApproval();
  }, [signer, accountAddress, staticZdteData, amount, premium, openingFees]);

  useEffect(() => {
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
        console.error('fail to validateCanOpenSpread: ', err);
      }
    }
    validateCanOpenSpread();
  }, [selectedSpreadPair, amount, getZdteContract]);

  useEffect(() => {
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
        console.error('fail to updateMargin: ', err);
      }
    }
    updateMargin();
  }, [selectedSpreadPair, amount, getZdteContract]);

  return (
    <div className="rounded-xl space-y-2 p-2">
      <div>
        <div className="flex flex-row justify-between">
          <div className="rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center min-w-max">
            <div className="flex flex-row h-10 w-auto p-1 pl-3 pr-2">
              <h6 className="mt-2 font-medium text-[0.8rem]">
                <span>
                  {getStrikeDisplay(selectedSpreadPair, zdteData?.tokenPrice)}
                </span>
              </h6>
            </div>
          </div>
          <MuiInput
            inputRef={textRef}
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="1"
            onFocus={() => {
              setAmount('1');
            }}
            type="number"
            className="h-16 text-md text-white font-mono mr-2"
            value={amount}
            onChange={handleTradeAmount}
            classes={{ input: 'text-right' }}
          />
        </div>
        <div className="flex justify-between">
          <div className=" flex mr-2 border border-white rounded-md ">
            {[10, 25, 50, 75, 100].map((option, i) => (
              <div
                key={i}
                className={`text-center w-auto cursor-pointer group hover:bg-mineshaft hover:opacity-80`}
                onClick={() => {
                  if (selectedSpreadPair?.shortStrike === undefined) return;

                  setTextInputRef(false);
                  setAmount(
                    premium === 0
                      ? 0
                      : Math.floor(
                          (option *
                            getUserReadableAmount(
                              userZdteLpData?.userQuoteTokenBalance!,
                              DECIMALS_USD
                            )) /
                            100 /
                            (premium + openingFees)
                        )
                  );
                }}
              >
                <h6 className="text-xs font-light py-2 px-2">
                  <span>{option}%</span>
                </h6>
              </div>
            ))}
          </div>
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
      <div className="p-1 space-y-1">
        <ContentRow
          title="Time to Expiry"
          content={
            zdteData?.expiry !== undefined ? (
              <h6 className="text-white">
                <Countdown
                  date={new Date(zdteData?.expiry * 1000)}
                  renderer={({ hours, minutes }) => {
                    return (
                      <div className="flex space-x-2">
                        <h6 className="text-white">
                          {hours}h {minutes}m
                        </h6>
                      </div>
                    );
                  }}
                />
              </h6>
            ) : (
              <div className="flex space-x-2">
                <h6 className="text-white">...</h6>
              </div>
            )
          }
        />
        <ContentRow
          title="Liquidity Required"
          content={
            selectedSpreadPair?.longStrike! > selectedSpreadPair?.shortStrike!
              ? `${margin} ${staticZdteData?.quoteTokenSymbol.toUpperCase()}`
              : `${margin} ${staticZdteData?.baseTokenSymbol.toUpperCase()}`
          }
        />
        <ContentRow
          title="Premium"
          content={`$${formatAmount(premium * Number(amount), 2)}`}
        />
        <ContentRow
          title="Fees"
          content={`$${formatAmount(openingFees * Number(amount), 2)}`}
        />
        <ContentRow
          title="Total Cost (Max Loss)"
          content={`~$${formatAmount(
            (premium + openingFees) * Number(amount),
            2
          )}`}
        />
        <div className="p-1">
          <PnlChart
            cost={roundToTwoDecimals(premium + openingFees)}
            selectedSpreadPair={selectedSpreadPair!}
            amount={Number(amount)}
          />
        </div>
      </div>
      <TradeButton
        amount={amount}
        selectedSpreadPair={selectedSpreadPair!}
        userZdteLpData={userZdteLpData!}
        handleApprove={handleApprove}
        handleOpenPosition={handleOpenPosition}
        approved={approved}
        canOpenSpread={canOpenSpread}
      />
    </div>
  );
};

export default TradeCard;
