import { useMemo } from 'react';
import { hexToBigInt } from 'viem';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import UniswapV3Pool from 'abis/clamm/UniswapV3Pool';
import { useContractRead } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import getLowerAndUpperTicksFromTick from 'utils/clamm/getLowerAndUpperTicksFromTick';
import getPriceFromTick from 'utils/clamm/getPriceFromTick';
import { formatAmount } from 'utils/general';

import ScaledSlider from './ScaledSlider';

type Props = {
  tickSpacing: number[];
  setTickSpacing: (spacing: number[]) => void;
  strikesSpacingMultipler: number[];
  setStrikesSpacingMultiplier: (spacing: number[]) => void;
};
const Settings = ({
  setStrikesSpacingMultiplier,
  setTickSpacing,
  strikesSpacingMultipler,
  tickSpacing,
}: Props) => {
  const { selectedOptionsMarket, tick } = useClammStore();

  const { data: poolTickSpacing } = useContractRead({
    abi: UniswapV3Pool,
    address: selectedOptionsMarket?.primePool,
    functionName: 'tickSpacing',
  });

  const previewInfo = useMemo(() => {
    if (!selectedOptionsMarket || !poolTickSpacing) return;
    const tickRounded = getLowerAndUpperTicksFromTick(tick, poolTickSpacing);
    const token0IsCallToken =
      hexToBigInt(selectedOptionsMarket.callToken.address) <
      hexToBigInt(selectedOptionsMarket.putToken.address);

    const token0Decimals = token0IsCallToken
      ? selectedOptionsMarket.callToken.decimals
      : selectedOptionsMarket.putToken.decimals;

    const token1Decimals = token0IsCallToken
      ? selectedOptionsMarket.putToken.decimals
      : selectedOptionsMarket.callToken.decimals;

    const [selectedTickSpacing] = tickSpacing;
    const [selectedStrikeSpacingMul] = strikesSpacingMultipler;

    const neutralRangePrices = {
      lower: getPriceFromTick(
        token0IsCallToken ? tickRounded.tickLower : tickRounded.tickUpper,
        10 ** token0Decimals,
        10 ** token1Decimals,
        !token0IsCallToken,
      ),
      upper: getPriceFromTick(
        (token0IsCallToken ? tickRounded.tickUpper : tickRounded.tickLower) +
          (poolTickSpacing === selectedTickSpacing ? 0 : selectedTickSpacing),
        10 ** token0Decimals,
        10 ** token1Decimals,
        !token0IsCallToken,
      ),
    };

    const difference = neutralRangePrices.upper - neutralRangePrices.lower;
    const strikesSpacing = difference * selectedStrikeSpacingMul;

    const putRangePrices = {
      lower: neutralRangePrices.lower - (difference + strikesSpacing),
      upper: neutralRangePrices.lower - strikesSpacing,
    };

    const callRangePrices = {
      lower: neutralRangePrices.upper + strikesSpacing,
      upper: neutralRangePrices.upper + (difference + strikesSpacing),
    };

    return {
      callRangePrices,
      putRangePrices,
      neutralRangePrices,
    };
  }, [
    selectedOptionsMarket,
    tick,
    poolTickSpacing,
    tickSpacing,
    strikesSpacingMultipler,
  ]);
  return (
    <Root>
      <Trigger>
        <Cog6ToothIcon height={14} width={14} />
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Content className="fixed border border-umbra top-[50%] left-[50%] w-[350px] translate-x-[-50%] translate-y-[-50%] bg-umbra rounded-xl flex flex-col p-[12px] space-y-[18px] text-[13px]">
          <Title>Range Selector Settings</Title>
          <Description className="w-full text-left text-stieglitz text-[10px]">
            Adjust following settings to increase or decrease range of strikes
            shown in the range selector.
          </Description>
          <div className="flex flex-col items-center justify-center w-full space-y-[12px] h-full">
            <div className="flex items-center justify-between w-full">
              <div className="text-stieglitz flex items-center space-x-[4px]">
                <span>Strikes Spacing</span>
                <InformationCircleIcon role="button" height={14} width={14} />
              </div>
              <ScaledSlider
                min={0}
                labels={['0x', '2x', '4x', '6x', '8x', '10x']}
                max={10}
                onChange={(v) => {
                  setStrikesSpacingMultiplier(v);
                }}
                value={strikesSpacingMultipler}
                steps={2}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-stieglitz flex items-center space-x-[4px]">
                <span>Tick Spacing</span>
                <InformationCircleIcon role="button" height={14} width={14} />
              </div>
              <ScaledSlider
                min={10}
                labels={[10, 20, 30]}
                max={30}
                onChange={(v) => {
                  setTickSpacing(v);
                }}
                value={tickSpacing}
                steps={10}
              />
            </div>
            <div className="w-full h-[150px] flex flex-col space-y-[12px]">
              <span className="text-[13px] text-stieglitz">Range Preview</span>
              <div className="flex w-full h-full bg-carbon  rounded-md p-[4px]">
                <div className="flex-1 flex items-center justify-center flex-col space-y-[2px]">
                  <span className="text-[10px] flex items-center space-x-[2px]">
                    <ArrowLongLeftIcon
                      height={24}
                      width={24}
                      className="text-stieglitz"
                    />
                    <span className="w-full text-stieglitz text-right">
                      Puts
                    </span>
                  </span>
                  <span className="h-full w-[20%] bg-down-bad"></span>
                  <span className="text-[8px] flex items-center w-full space-x-[20%]">
                    <span className="text-right w-full">
                      {previewInfo
                        ? formatAmount(previewInfo.putRangePrices.lower, 3)
                        : 0}
                    </span>
                    <span className="text-left w-full">
                      {previewInfo
                        ? formatAmount(previewInfo.putRangePrices.upper, 3)
                        : 0}
                    </span>
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center flex-col space-y-[2px]">
                  <span className="text-[10px] flex items-center space-x-[2px]">
                    <span className="w-full text-stieglitz text-right">
                      Neutral
                    </span>
                  </span>
                  <span className="h-full w-[20%] bg-mineshaft"></span>
                  <span className="text-[8px] flex items-center w-full space-x-[20%]">
                    <span className="text-right w-full">
                      {previewInfo
                        ? formatAmount(previewInfo.neutralRangePrices.lower, 3)
                        : 0}
                    </span>
                    <span className="text-left w-full">
                      {previewInfo
                        ? formatAmount(previewInfo.neutralRangePrices.upper, 3)
                        : 0}
                    </span>
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center flex-col">
                  <span className="text-[10px] flex items-center space-x-[2px]">
                    <span className="w-full text-stieglitz text-left">
                      Calls
                    </span>
                    <ArrowLongRightIcon
                      height={24}
                      width={24}
                      className="text-stieglitz"
                    />
                  </span>
                  <span className="h-full w-[20%] bg-up-only"></span>
                  <span className="text-[8px] flex items-center w-full space-x-[20%]">
                    <span className="text-right w-full">
                      {previewInfo
                        ? formatAmount(previewInfo.callRangePrices.lower, 3)
                        : 0}
                    </span>
                    <span className="text-left w-full">
                      {previewInfo
                        ? formatAmount(previewInfo.callRangePrices.upper, 3)
                        : 0}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-[12px] w-full">
            <Close className="bg-mineshaft p-[4px] w-[100px] rounded-md hover:bg-carbon text-[13px]">
              Close
            </Close>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default Settings;
